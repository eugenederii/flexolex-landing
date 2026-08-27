"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Check, Phone, ShieldCheck, Truck, User } from "lucide-react";
import { pricing } from "@/data/site";
import { successDisplayFont } from "@/lib/fonts";
import { ORDER_SECTION_ID } from "@/lib/scrollToOrder";
import {
  formatPhoneInput,
  submitLead,
  validateLeadForm,
} from "@/lib/leadForm";
import { trackLead } from "@/lib/tracking";
import type { LeadFormErrorCodes, LeadFormErrors, LeadFormValues, LeadSubmitStatus } from "@/types";
import { useLanguage } from "@/components/LanguageProvider";
import type { Dictionary } from "@/data/locales";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/Section";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProductPlaceholder } from "@/components/ui/ProductPlaceholder";
import { TurnstileWidget, isTurnstileConfiguredClient } from "@/components/TurnstileWidget";

const emptyValues: LeadFormValues = { fullName: "", phone: "", callConsent: false };

/** Maps locale-agnostic validation codes to the active dictionary's strings. */
function toDisplayErrors(codes: LeadFormErrorCodes, order: Dictionary["order"]): LeadFormErrors {
  const errors: LeadFormErrors = {};
  if (codes.fullName) errors.fullName = order.errorNameRequired;
  if (codes.phone === "required") errors.phone = order.errorPhoneRequired;
  if (codes.phone === "invalid") errors.phone = order.errorPhoneInvalid;
  if (codes.callConsent) errors.callConsent = order.errorCallConsentRequired;
  return errors;
}

export function OrderSection() {
  const { t } = useLanguage();
  const copy = t.order;
  const formId = useId();
  const [values, setValues] = useState<LeadFormValues>(emptyValues);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<LeadSubmitStatus>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const setField = (field: "fullName" | "phone") => (raw: string) => {
    const value = field === "phone" ? formatPhoneInput(raw) : raw;
    setValues((current) => ({ ...current, [field]: value }));

    // Only correct errors live once the visitor has already tried to submit —
    // shouting at someone mid-typing is the fastest way to lose them.
    if (submitted) {
      setErrors(toDisplayErrors(validateLeadForm({ ...values, [field]: value }), copy));
    }

    // A stale "something went wrong" banner from a previous failed attempt
    // must not linger once the visitor is actively correcting the form.
    if (status === "error") setStatus("idle");
  };

  const setCallConsent = (checked: boolean) => {
    setValues((current) => ({ ...current, callConsent: checked }));

    if (submitted) {
      setErrors(toDisplayErrors(validateLeadForm({ ...values, callConsent: checked }), copy));
    }

    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // A request is already in flight — the submit button is disabled for
    // exactly this case, but this guards against a stray Enter-key resubmit
    // slipping through before the disabled state re-renders.
    if (status === "submitting") return;

    setSubmitted(true);

    // Bot trap: real people never fill a field they cannot see.
    if (honeypotRef.current?.value) return;

    const nextCodes = validateLeadForm(values);
    const nextErrors = toDisplayErrors(nextCodes, copy);
    setErrors(nextErrors);

    if (Object.keys(nextCodes).length > 0) {
      const firstField = Object.keys(nextCodes)[0] as keyof LeadFormValues;
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    // Turnstile is configured but hasn't produced a token yet — for most
    // real visitors this resolves in under a second, but a very fast
    // submit or a slow connection can beat it. The server enforces this
    // regardless; this just avoids a submission we already know will fail.
    if (isTurnstileConfiguredClient() && !turnstileToken) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const result = await submitLead(values, turnstileToken ?? undefined);

    if (!result.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    window.setTimeout(() => successRef.current?.focus(), 60);

    // CONVERSION — only reachable after EZAFF has confirmed the lead and
    // returned an order id (see submitLead / app/api/lead/route.ts). Never
    // called on click, on validation passing, or optimistically.
    trackLead(result.metaLeadEventId!, result.leadId!, pricing.current);
  };

  const succeeded = status === "success";

  return (
    <Section
      id={ORDER_SECTION_ID}
      tone="deep"
      bare
      className={cn(
        "scroll-mt-24 pt-12 sm:pt-14 lg:pt-16",
        // A bit more breathing room after the success card specifically —
        // makes the drop into the next (dark navy) section read as
        // intentional rather than abrupt. The mobile-viewport-fit
        // requirement is about the card itself, not this trailing space.
        succeeded ? "success-aurora-bg pb-20 sm:pb-24 lg:pb-28" : "grain pb-12 sm:pb-14 lg:pb-16",
      )}
    >
      <div className="container-page">
        {!succeeded && (
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="eyebrow justify-center">
              <span aria-hidden="true" className="h-px w-6 bg-navy/40" />
              {copy.eyebrow}
            </p>
            <h2
              data-scroll-focus
              tabIndex={-1}
              className="mt-4 text-3xl outline-none sm:text-4xl"
            >
              {copy.title}
            </h2>
            <p className="mt-5 text-lg text-ink-soft">{copy.lead}</p>
          </Reveal>
        )}

        <Reveal className={succeeded ? "" : "mt-10 lg:mt-14"}>
          <div
            className={cn(
              "mx-auto max-w-xl overflow-hidden rounded-[1.5rem] lg:rounded-[2rem]",
              succeeded
                ? cn("success-aurora success-card-pearl p-3.5 sm:p-7 lg:p-8", successDisplayFont.variable)
                : "bg-surface p-7 shadow-lift sm:p-9 lg:p-10",
            )}
          >
            {succeeded ? (
              <div
                role="status"
                aria-live="polite"
                className="animate-success-card-in flex flex-col items-center text-center"
              >
                {/* Success medallion — layered halo + pearlescent ring + frosted seal */}
                <div className="animate-medallion-in relative grid size-14 place-items-center">
                  <span
                    aria-hidden="true"
                    className="absolute size-20 rounded-full bg-[radial-gradient(circle,rgba(138,121,242,0.32),transparent_72%)] blur-lg"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute size-12 rounded-full bg-gradient-to-br from-[#bcd6fb] via-[#cdbdf7] to-[#f3ddf0]"
                  />
                  <span className="relative grid size-10 place-items-center rounded-full bg-white/85 shadow-[0_2px_10px_rgba(70,55,101,0.18)] ring-1 ring-white/80 backdrop-blur-sm">
                    <Check className="size-5 text-[color:var(--sa-checkmark)]" strokeWidth={2.4} />
                  </span>
                </div>

                <p
                  ref={successRef}
                  tabIndex={-1}
                  className="mt-2 text-base font-bold tracking-[-0.01em] text-[color:var(--sa-plum-soft)] outline-none sm:text-lg"
                >
                  {copy.successTitle}
                </p>
                <p className="mt-0.5 text-sm text-[color:var(--sa-text-soft)]">{copy.successBody}</p>

                {/* Main message — the strongest line on this screen */}
                <p className="mt-3 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--sa-eyebrow)]">
                  <span aria-hidden="true" className="h-px w-5 bg-[#7466c5]/35" />
                  {copy.successEyebrow}
                </p>
                <p className="mt-2 text-lg leading-[1.28] font-semibold tracking-[-0.01em] text-[color:var(--sa-plum)] [font-family:var(--font-sora),var(--font-display),sans-serif] sm:max-w-sm sm:text-2xl sm:leading-[1.25]">
                  {copy.successHeadline}
                </p>

                {/* 3-step progress: Request (done) -> Confirm (active, hero) -> Delivery (upcoming) */}
                <div className="mt-3 grid w-full max-w-[19rem] grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-x-2 sm:mt-6 sm:max-w-sm">
                  {/* Request — soft translucent aqua-glass, an off-center highlight standing in for "inner light" */}
                  <span className="relative grid size-7 place-items-center sm:size-8">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.92),rgba(189,238,231,0.6)_46%,rgba(121,207,198,0.55)_100%)] ring-1 ring-white/60"
                    />
                    <Check className="relative size-3.5 text-[color:var(--sa-aqua-icon)] sm:size-4" strokeWidth={2.6} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-[2px] rounded-full bg-gradient-to-r from-[color:var(--sa-aqua)]/65 via-[#9b8fef]/75 to-[color:var(--sa-active-light)]/85"
                  />

                  {/* Confirm — the hero: richer 3-stop gradient, glassy sheen, halo + ring */}
                  <span className="relative grid size-10 place-items-center sm:size-11">
                    <span
                      aria-hidden="true"
                      className="animate-pulse-ring absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(116,103,232,0.4),transparent_70%)] blur-md"
                      style={{ animationDelay: "550ms" }}
                    />
                    <span aria-hidden="true" className="absolute -inset-1 rounded-full ring-2 ring-white/70" />
                    <span className="relative grid size-full place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[color:var(--sa-active-light)] via-[#7b78ea] to-[color:var(--sa-active-deep)] text-white shadow-[0_12px_26px_-8px_rgba(116,103,232,0.6)]">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,0.45),transparent_55%)]"
                      />
                      <Phone className="relative size-4 sm:size-4.5" strokeWidth={2.3} />
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-[2px] rounded-full bg-gradient-to-r from-[color:var(--sa-active-light)]/40 to-[color:var(--sa-champagne)]/45"
                  />
                  {/* Delivery — same glassy treatment as Request, warmed into champagne */}
                  <span className="relative grid size-7 place-items-center sm:size-8">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,252,244,0.92),rgba(247,235,217,0.6)_46%,rgba(243,221,198,0.6)_100%)] ring-1 ring-white/60"
                    />
                    <Truck className="relative size-4 text-[color:var(--sa-champagne-icon)] sm:size-4.5" strokeWidth={2.2} />
                  </span>

                  <span className="mt-1 text-center text-xs font-semibold text-[color:var(--sa-text-soft)]">
                    {copy.successStepRequest}
                  </span>
                  <span aria-hidden="true" />
                  <span className="mt-1 text-center text-xs font-bold text-[color:var(--sa-active-text)]">
                    {copy.successStepConfirm}
                  </span>
                  <span aria-hidden="true" />
                  <span className="mt-1 text-center text-xs font-medium text-[color:var(--sa-text-muted)]">
                    {copy.successStepDelivery}
                  </span>
                </div>

                {/* Next step — the second premium surface, clear but not alarming */}
                <div className="success-card-pearl-quiet mt-3 flex w-full items-start gap-2.5 rounded-2xl p-2.5 text-left sm:mt-6 sm:gap-3 sm:p-4">
                  <span className="relative mt-0.5 grid size-7 shrink-0 place-items-center sm:size-8">
                    <span
                      aria-hidden="true"
                      className="absolute -inset-1 rounded-full bg-[radial-gradient(circle,rgba(116,103,232,0.2),transparent_70%)] blur-sm"
                    />
                    <span className="relative grid size-full place-items-center rounded-full bg-gradient-to-br from-[color:var(--sa-active-light)] to-[color:var(--sa-active-deep)] text-white shadow-[0_3px_9px_-3px_rgba(116,103,232,0.4)]">
                      <Phone className="size-3.5 sm:size-4" strokeWidth={2.1} />
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[color:var(--sa-eyebrow)]">
                      {copy.successCardEyebrow}
                    </p>
                    <p className="mt-1 text-[0.95rem] leading-snug font-bold tracking-[-0.01em] text-[color:var(--sa-plum-soft)]">
                      {copy.successCardHeadline}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-[color:var(--sa-text-soft)]">{copy.successNote}</p>
                    <p className="mt-1.5 text-xs leading-snug text-[color:var(--sa-text-muted)]">{copy.successFooter}</p>
                  </div>
                </div>

                {/* Brand reminder — small, lowest priority, hidden on small screens */}
                <ProductPlaceholder id="order-success" className="mt-4 hidden w-14 sm:block" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-6">
                  <FormInput
                    id={`${formId}-fullName`}
                    name="fullName"
                    label={copy.nameLabel}
                    placeholder={copy.namePlaceholder}
                    autoComplete="name"
                    value={values.fullName}
                    onChange={(event) => setField("fullName")(event.target.value)}
                    error={errors.fullName}
                    icon={<User className="size-5" strokeWidth={1.9} />}
                    required
                  />

                  <FormInput
                    id={`${formId}-phone`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    label={copy.phoneLabel}
                    placeholder={copy.phonePlaceholder}
                    autoComplete="tel"
                    value={values.phone}
                    onChange={(event) => setField("phone")(event.target.value)}
                    error={errors.phone}
                    prefix="+63"
                    required
                  />

                  <div>
                    <label
                      htmlFor={`${formId}-callConsent`}
                      className="flex cursor-pointer items-start gap-3"
                    >
                      <input
                        id={`${formId}-callConsent`}
                        name="callConsent"
                        type="checkbox"
                        checked={values.callConsent}
                        onChange={(event) => setCallConsent(event.target.checked)}
                        required
                        aria-invalid={errors.callConsent ? true : undefined}
                        aria-describedby={errors.callConsent ? `${formId}-callConsent-error` : undefined}
                        className={cn(
                          "mt-0.5 size-5 shrink-0 rounded-md border-2 bg-surface text-navy",
                          "transition-colors duration-200 outline-none",
                          "focus-visible:ring-4 focus-visible:ring-navy/12",
                          errors.callConsent ? "border-danger" : "border-line-strong",
                        )}
                      />
                      <span className="text-sm text-ink-soft">{copy.callConsentLabel}</span>
                    </label>

                    {errors.callConsent && (
                      <p
                        id={`${formId}-callConsent-error`}
                        className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-danger"
                      >
                        <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                        {errors.callConsent}
                      </p>
                    )}
                  </div>

                  {/* Honeypot — hidden from people and from assistive tech */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute h-0 w-0 opacity-0"
                  />
                </div>

                <TurnstileWidget onToken={setTurnstileToken} />

                {status === "error" && (
                  <p
                    role="alert"
                    className="mt-6 rounded-xl bg-danger/8 p-4 text-sm font-semibold text-danger"
                  >
                    {copy.failure}
                  </p>
                )}

                <p className="mt-4 flex items-start justify-center gap-2 text-center text-sm text-ink-soft">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-navy" strokeWidth={2} />
                  {copy.noPaymentNote}
                </p>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={status === "submitting"}
                  className="mt-4"
                >
                  {status === "submitting" ? copy.submitting : t.common.orderNow}
                </Button>

                <p className="mt-3 text-center text-xs text-ink-muted">{copy.reserveNote}</p>

                <p className="mt-6 flex items-start gap-2.5 text-sm text-ink-muted">
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4.5 shrink-0 text-navy"
                    strokeWidth={2}
                  />
                  {copy.privacy}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
