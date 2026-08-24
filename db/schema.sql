-- ==========================================================================
-- Flexolex — lead + EZAFF status persistence schema
-- --------------------------------------------------------------------------
-- Idempotent: safe to run more than once (CREATE ... IF NOT EXISTS
-- throughout). Applied with `npm run db:migrate` (see scripts/migrate.mjs),
-- which reads this file and executes it against DATABASE_URL.
--
-- Two tables:
--   leads               current state of each submitted lead (one row per
--                       publisher_order_id).
--   ezaff_status_events append-only history of every EZAFF postback we
--                       accepted, so "new -> hold -> approve" is
--                       distinguishable from just seeing "approve".
-- ==========================================================================

CREATE TABLE IF NOT EXISTS leads (
  id                  BIGSERIAL PRIMARY KEY,

  -- Correlation identifiers. publisher_order_id is generated server-side
  -- with crypto.randomUUID() before we ever call EZAFF (see
  -- src/app/api/lead/route.ts) and is the primary key we correlate on.
  -- ezaff_order_id is only known once EZAFF has accepted the lead.
  publisher_order_id  UUID NOT NULL,
  ezaff_order_id      TEXT,
  offer_id            TEXT NOT NULL,

  -- Current status. 'pending'/'submission_failed' are local-only states
  -- that never come from EZAFF (see src/lib/leadStatus.ts); the other five
  -- are exactly EZAFF's postback statuses.
  status              TEXT NOT NULL DEFAULT 'pending',
  payout              NUMERIC(12, 2),

  -- Attribution actually forwarded to EZAFF at submission time (see
  -- src/lib/ezaff.ts) — preserved here, verbatim, as ORIGINAL context.
  -- Postback callbacks may echo these back but never overwrite these
  -- columns; see ezaff_status_events for what a given callback carried.
  click_id            TEXT,
  publisher_sub_id    TEXT,
  extra_id_1          TEXT,
  extra_id_2          TEXT,
  stream_id           TEXT,

  -- Additional attribution captured from the visitor's URL/session (see
  -- src/lib/urlParams.ts) that is NOT currently sent to EZAFF but is worth
  -- keeping for future Meta CAPI matching.
  fb_pixel_param      TEXT,
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  utm_content         TEXT,
  utm_term            TEXT,

  -- Meta ad-click attribution — fbclid/campaign_id/adset_id/ad_id come from
  -- URL params (src/lib/urlParams.ts), fbp/fbc from the visitor's Meta
  -- cookies read fresh at submission time (src/lib/metaAttribution.ts).
  -- NULL simply means this particular visit had no Meta ad-click context
  -- (e.g. direct/organic traffic) — never fabricated.
  fbclid              TEXT,
  fbp                 TEXT,
  fbc                 TEXT,
  campaign_id         TEXT,
  adset_id            TEXT,
  ad_id               TEXT,

  -- Request context captured server-side at submission time.
  ref_url             TEXT,
  client_ip           TEXT,
  user_agent          TEXT,

  -- Minimal, privacy-conscious identity for future Meta CAPI phone
  -- matching. phone_hash is SHA-256 of the E.164-normalized digits (no
  -- raw phone number is ever stored). phone_last4 is a non-sensitive
  -- operational aid for matching a support call to a row by eye.
  phone_hash          TEXT,
  phone_last4         TEXT,

  -- Schema prep only — never written by this task. Lets a future Meta CAPI
  -- step record "already sent" per lead so duplicate postbacks can't cause
  -- duplicate conversion events.
  meta_conversion_sent_at TIMESTAMPTZ,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT leads_status_check CHECK (
    status IN ('pending', 'submission_failed', 'new', 'hold', 'approve', 'cancel', 'trash')
  )
);

-- Multiple NULLs are allowed under a UNIQUE constraint in Postgres, so many
-- pending leads (ezaff_order_id still NULL) can coexist; only a non-null
-- value must be unique.
CREATE UNIQUE INDEX IF NOT EXISTS leads_publisher_order_id_key ON leads (publisher_order_id);
CREATE UNIQUE INDEX IF NOT EXISTS leads_ezaff_order_id_key ON leads (ezaff_order_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);

-- --------------------------------------------------------------------------
-- Additive migration — Meta Pixel event id + explicit client-captured
-- landing URL. Added via ALTER, not by editing the CREATE TABLE above:
-- this schema.sql is re-applied (via `npm run db:migrate`) against an
-- already-existing production `leads` table with real rows in it, and
-- CREATE TABLE IF NOT EXISTS is a no-op there — only ALTER ... ADD COLUMN
-- IF NOT EXISTS actually reaches an existing table. Idempotent, additive,
-- never drops/truncates/recreates anything.
-- --------------------------------------------------------------------------
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meta_lead_event_id UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS event_source_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS leads_meta_lead_event_id_key ON leads (meta_lead_event_id);

CREATE TABLE IF NOT EXISTS ezaff_status_events (
  id                  BIGSERIAL PRIMARY KEY,
  lead_id             BIGINT NOT NULL REFERENCES leads (id) ON DELETE CASCADE,

  -- Denormalized alongside lead_id so this table can be queried/debugged
  -- without a join — a deliberate, small duplication typical of audit logs.
  ezaff_order_id      TEXT NOT NULL,
  publisher_order_id  UUID NOT NULL,
  status              TEXT NOT NULL,
  payout              NUMERIC(12, 2),
  click_id            TEXT,
  extra_id_1          TEXT,
  extra_id_2          TEXT,

  -- Whether this event actually changed the lead's current status (per
  -- src/lib/leadStatus.ts's shouldApplyStatus policy) vs. was recorded but
  -- ignored as stale/terminal-frozen. Answers "why didn't approve show up".
  applied             BOOLEAN NOT NULL,

  -- SHA-256 fingerprint of (ezaff_order_id, publisher_order_id, status,
  -- payout, click_id, extra_id_1, extra_id_2) — see src/lib/leadStore.ts.
  -- A UNIQUE constraint on this is the idempotency mechanism: EZAFF retrying
  -- the exact same callback produces the exact same fingerprint, so the
  -- insert becomes a no-op (ON CONFLICT DO NOTHING) instead of a duplicate
  -- row. A genuinely different callback (e.g. a corrected payout) has a
  -- different fingerprint and is recorded as a new event.
  dedupe_key          TEXT NOT NULL,

  received_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT ezaff_status_events_status_check CHECK (
    status IN ('new', 'hold', 'approve', 'cancel', 'trash')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS ezaff_status_events_dedupe_key_key ON ezaff_status_events (dedupe_key);
CREATE INDEX IF NOT EXISTS ezaff_status_events_lead_id_idx ON ezaff_status_events (lead_id);
CREATE INDEX IF NOT EXISTS ezaff_status_events_ezaff_order_id_idx ON ezaff_status_events (ezaff_order_id);

-- --------------------------------------------------------------------------
-- Additive migration — durable rate limiting (see src/lib/rateLimit.ts).
-- Replaces the previous in-memory-only duplicate guard (lib/leadDedupe.ts,
-- removed), which reset on every serverless cold start and wasn't shared
-- across concurrent Vercel instances. ip_hash is an HMAC-SHA256 of the
-- visitor's IP keyed by RATE_LIMIT_SECRET — the raw IP is never stored
-- here (see `leads.client_ip` for where a raw IP IS legitimately kept, for
-- future CAPI matching — a separate, already-justified purpose).
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lead_submission_attempts (
  id          BIGSERIAL PRIMARY KEY,
  ip_hash     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_submission_attempts_ip_hash_created_at_idx
  ON lead_submission_attempts (ip_hash, created_at);

-- --------------------------------------------------------------------------
-- Additive migration — required "agree to be called" consent checkbox (see
-- src/app/api/lead/route.ts, which re-validates this server-side and never
-- trusts the client). DEFAULT false exists only to satisfy NOT NULL for the
-- backfill of pre-existing rows created before this column existed — it is
-- never an implicit "yes" for a NEW submission, which is rejected with 400
-- before a row is ever inserted unless the visitor actually checked the box.
-- --------------------------------------------------------------------------
ALTER TABLE leads ADD COLUMN IF NOT EXISTS call_consent BOOLEAN NOT NULL DEFAULT false;
