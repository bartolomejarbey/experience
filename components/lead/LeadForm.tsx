"use client";

import { useActionState } from "react";

import { submitLead } from "@/app/actions/submit-lead";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useConfig } from "@/lib/config/useConfig";
import { formatPrice } from "@/lib/format";
import { LEAD_FORM_INITIAL_STATE } from "@/lib/types/lead";

export function LeadForm() {
  const { model, state, price } = useConfig();
  const [formState, formAction, isPending] = useActionState(
    submitLead,
    LEAD_FORM_INITIAL_STATE,
  );

  if (formState.status === "success") {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-ink text-2xl">Děkujeme.</h3>
        <p className="text-ink-muted">
          Vaši poptávku jsme přijali. Ozveme se Vám do dvou pracovních dnů
          na e-mail nebo telefon, který jste uvedli.
        </p>
      </div>
    );
  }

  const fieldErrors = formState.status === "error" ? formState.fieldErrors : undefined;
  const errorMessage = formState.status === "error" ? formState.message : undefined;

  const configSummary = model.configurations
    .map((cfg) => {
      const opt = cfg.options.find((o) => o.id === state[cfg.key]);
      return opt?.labelCs ?? "—";
    })
    .join(" · ");

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="modelId" value={model.id} />
      <input type="hidden" name="computedPrice" value={String(price)} />
      {Object.entries(state).map(([key, value]) => (
        <input key={key} type="hidden" name={`config:${key}`} value={value} />
      ))}

      {/* Honeypot — off-screen, not aria-hidden (bots ignore aria). */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Web (nevyplňujte)
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        label="Jméno a příjmení"
        name="name"
        autoComplete="name"
        required
        placeholder="např. Jan Novák"
        error={fieldErrors?.name}
      />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vy@email.cz"
        error={fieldErrors?.email}
      />
      <Field
        label="Telefon"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
        placeholder="+420 777 123 456"
        hint="Včetně mezinárodní předvolby."
        error={fieldErrors?.phone}
      />
      <Field
        label="Zpráva"
        name="message"
        multiline
        rows={4}
        placeholder="Co byste se rádi dozvěděli? (nepovinné)"
        error={fieldErrors?.message}
      />

      <div className="flex flex-col gap-3 pt-2">
        <div className="bg-cream rounded-control border-brown/10 border p-4">
          <div className="text-ink-muted text-sm">Vaše konfigurace</div>
          <div className="font-display text-ink mt-1 text-2xl">{formatPrice(price)}</div>
          <div className="text-ink-muted mt-1 text-xs">
            Model {model.name} · {configSummary}
          </div>
        </div>

        {errorMessage && (
          <p role="alert" className="text-terracotta text-sm">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          className="w-full"
        >
          Odeslat poptávku
        </Button>

        <p className="text-ink-muted text-center text-xs">
          Odesláním souhlasíte se zpracováním Vašich osobních údajů za účelem
          vyřízení poptávky.
        </p>
      </div>
    </form>
  );
}
