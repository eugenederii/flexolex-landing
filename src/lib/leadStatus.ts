/* ==========================================================================
   LEAD STATUS — the status vocabulary + transition policy
   --------------------------------------------------------------------------
   Not server-only: these are plain types/constants, safe to reference from
   either side if ever needed, and importing them doesn't pull in the DB or
   EZAFF request code.

   Two categories, kept logically distinct even though a lead's `status`
   column holds either kind:
     - LOCAL_LEAD_STATUSES: states that exist only in our system, before
       EZAFF has confirmed anything (or after EZAFF has explicitly refused
       the submission). Never sent to or received from EZAFF.
     - EZAFF_LEAD_STATUSES: the exact 5 values EZAFF's postback can report.
       This is the source of truth for that enum — lib/ezaffPostback.ts
       imports it from here (not the other way around) to avoid a circular
       dependency with lib/leadStore.ts, which also needs it.
   ========================================================================== */

export const LOCAL_LEAD_STATUSES = ["pending", "submission_failed"] as const;
export type LocalLeadStatus = (typeof LOCAL_LEAD_STATUSES)[number];

export const EZAFF_LEAD_STATUSES = ["new", "hold", "approve", "cancel", "trash"] as const;
export type EzaffLeadStatus = (typeof EZAFF_LEAD_STATUSES)[number];

export type LeadStatus = LocalLeadStatus | EzaffLeadStatus;
export const ALL_LEAD_STATUSES = [...LOCAL_LEAD_STATUSES, ...EZAFF_LEAD_STATUSES] as const;

export function isEzaffLeadStatus(value: string): value is EzaffLeadStatus {
  return (EZAFF_LEAD_STATUSES as readonly string[]).includes(value);
}

/** How far along the funnel each status represents. Terminal statuses share the top rank. */
const STATUS_RANK: Record<LeadStatus, number> = {
  pending: 0,
  submission_failed: 0,
  new: 1,
  hold: 2,
  approve: 3,
  cancel: 3,
  trash: 3,
};

const TERMINAL_STATUSES: ReadonlySet<LeadStatus> = new Set(["approve", "cancel", "trash"]);

export function isTerminalStatus(status: LeadStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

/**
 * Whether an incoming EZAFF postback status should become the lead's new
 * current status, given its current status. Used by leadStore.applyEzaffPostback
 * — the postback's raw event is always recorded in ezaff_status_events
 * regardless of this answer; this only governs the lead's CURRENT status.
 *
 * - Once a lead is terminal (approve/cancel/trash), only an exact repeat of
 *   that SAME status is accepted (a duplicate callback or a payout
 *   correction). A different status — terminal or not — is ignored. EZAFF's
 *   docs don't describe reversals (e.g. approve -> cancel via chargeback),
 *   so this deliberately doesn't invent handling for one; if that turns out
 *   to be real, this is the one place to revisit.
 * - Otherwise, forward or equal progress is accepted (new -> hold ->
 *   approve, or a repeat of the same non-terminal status). A status that
 *   would rank *behind* the current one — a stale, delayed callback — is
 *   rejected. This is what stops a delayed `new` from undoing an
 *   already-recorded `hold`.
 */
export function shouldApplyStatus(current: LeadStatus, incoming: EzaffLeadStatus): boolean {
  if (isTerminalStatus(current)) return incoming === current;
  return STATUS_RANK[incoming] >= STATUS_RANK[current];
}

/**
 * One validated EZAFF postback callback. Defined here (not in
 * ezaffPostback.ts) so both ezaffPostback.ts and leadStore.ts can import it
 * without a circular dependency — ezaffPostback.ts calls into leadStore.ts
 * for persistence, so leadStore.ts must not import from ezaffPostback.ts.
 */
export interface EzaffPostbackInput {
  status: EzaffLeadStatus;
  /** EZAFF's own order id, e.g. "3584917" — distinct from publisherOrderId. */
  ezaffOrderId: string;
  /** Our crypto.randomUUID() id generated in app/api/lead/route.ts. */
  publisherOrderId: string;
  /** null when absent or not a valid finite number — never fabricated, never coerced to 0. */
  payout: number | null;
  clickId?: string;
  extraId1?: string;
  extraId2?: string;
}
