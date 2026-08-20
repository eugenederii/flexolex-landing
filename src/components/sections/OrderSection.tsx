"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, ShieldCheck, User } from "lucide-react";
import { pricing } from "@/data/site";
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
import { Section } from "@/components/ui/Section";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TurnstileWidget, isTurnstileConfiguredClient } from "@/components/TurnstileWidget";

const emptyValues: LeadFormValues = { fullName: "", phone: "" };

/** Maps locale-agnostic validation codes to the active dictionary's strings. */
function toDisplayErrors(codes: LeadFormErrorCodes, order: Dictionary["order"]): LeadFormErrors {
  const errors: LeadFormErrors = {};
  if (codes.fullName) errors.fullName = order.errorNameRequired;
  if (codes.phone === "required") errors.phone = order.errorPhoneRequired;
  if (codes.phone === "invalid") errors.phone = order.errorPhoneInvalid;
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

  const setField = (field: keyof LeadFormValues) => (raw: string) => {
    const value = field === "phone" ? formatPhoneInput(raw) : raw;
    setValues((current) => ({ ...current, [field]: value }));

    // Only correct errors live once the visitor has already tried to submit —
    // shouting at someone mid-typing is the fastest way to lose them.
    if (submitted) {
      setErrors(toDisplayErrors(validateLeadForm({ ...values, [field]: value }), copy));
    }
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
      className="grain scroll-mt-24 pt-12 pb-12 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16"
    >
      <div className="container-page">
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

        <Reveal className="mt-10 lg:mt-14">
          <div className="mx-auto max-w-xl overflow-hidden rounded-[1.5rem] bg-surface p-7 shadow-lift sm:p-9 lg:rounded-[2rem] lg:p-10">
            {succeeded ? (
              <div
                role="status"
                aria-live="polite"
                className="animate-slide-up-in flex flex-col items-center py-6 text-center"
              >
                <span
                  aria-hidden="true"
                  className="grid size-18 place-items-center rounded-full bg-sky-mist text-navy"
                >
                  <CheckCircle2 className="size-9" strokeWidth={1.8} />
                </span>

                <p
                  ref={successRef}
                  tabIndex={-1}
                  className="mt-6 font-display text-3xl font-bold tracking-[-0.02em] text-ink outline-none"
                >
                  {copy.successTitle}
                </p>
                <p className="mt-4 text-lg text-ink-soft">{copy.successBody}</p>
                <p className="mt-2 text-lg font-semibold text-navy">{copy.successNote}</p>

                <p className="mt-8 max-w-xs text-sm text-ink-muted">{copy.successFooter}</p>
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

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={status === "submitting"}
                  className="mt-8"
                >
                  {status === "submitting" ? copy.submitting : t.common.orderNow}
                </Button>

                <p className="mt-6 text-center text-sm text-ink-soft">{copy.reassurance}</p>

                <p className="mt-3 flex items-start gap-2.5 text-sm text-ink-muted">
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
