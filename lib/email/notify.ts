import "server-only";

import { Resend } from "resend";

import { formatDateTime, formatPrice } from "@/lib/format";
import type { Lead } from "@/lib/types/lead";
import type { Model } from "@/lib/types/model";

let resend: Resend | null = null;

function getResend(): Resend {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY env var is missing.");
  }
  resend = new Resend(key);
  return resend;
}

const HTML_ESCAPES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  '"': "&quot;",
  "'": "&#39;",
};

function esc(value: string): string {
  return value.replace(/[<>&"']/g, (c) => HTML_ESCAPES[c] ?? c);
}

function describeConfiguration(lead: Lead, model: Model): { label: string; value: string }[] {
  return model.configurations.map((cfg) => {
    const optionId = lead.configuration[cfg.key];
    const option = cfg.options.find((o) => o.id === optionId);
    return {
      label: cfg.labelCs,
      value: option?.labelCs ?? optionId ?? "—",
    };
  });
}

export async function sendLeadNotification(lead: Lead, model: Model): Promise<void> {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "AURA Homes <noreply@aurahomes.cz>";

  if (!to) {
    throw new Error("LEAD_NOTIFICATION_EMAIL env var is missing.");
  }

  const subject = `Nová poptávka — ${model.name} (${formatPrice(lead.computedPrice)})`;
  const configRows = describeConfiguration(lead, model);
  const sentAt = formatDateTime(new Date());

  const html = `
<div style="font-family:'Inter Tight',-apple-system,system-ui,sans-serif;color:#1a1612;max-width:560px;line-height:1.6;">
  <h1 style="font-family:'Fraunces',Georgia,serif;font-weight:500;color:#b8845f;font-size:28px;margin:0 0 8px;">Nová poptávka</h1>
  <p style="margin:0 0 24px;color:#4a3526;">Model <strong style="color:#1a1612;">${esc(model.name)}</strong> v ceně <strong style="color:#1a1612;">${esc(formatPrice(lead.computedPrice))}</strong>.</p>

  <h2 style="font-family:'Fraunces',Georgia,serif;font-weight:500;color:#1a1612;font-size:18px;margin:24px 0 8px;">Kontakt</h2>
  <table style="border-collapse:collapse;">
    <tr><td style="padding:4px 16px 4px 0;color:#4a3526;">Jméno</td><td><strong>${esc(lead.name)}</strong></td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#4a3526;">E-mail</td><td><a href="mailto:${esc(lead.email)}" style="color:#b8845f;">${esc(lead.email)}</a></td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#4a3526;">Telefon</td><td><a href="tel:${esc(lead.phone)}" style="color:#b8845f;">${esc(lead.phone)}</a></td></tr>
  </table>

  ${
    lead.message
      ? `<h2 style="font-family:'Fraunces',Georgia,serif;font-weight:500;color:#1a1612;font-size:18px;margin:24px 0 8px;">Zpráva</h2><p style="white-space:pre-wrap;background:#f5f0e6;padding:16px;border-radius:8px;margin:0;">${esc(lead.message)}</p>`
      : ""
  }

  <h2 style="font-family:'Fraunces',Georgia,serif;font-weight:500;color:#1a1612;font-size:18px;margin:24px 0 8px;">Konfigurace</h2>
  <table style="border-collapse:collapse;">
    ${configRows
      .map(
        (r) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#4a3526;">${esc(r.label)}</td><td><strong>${esc(r.value)}</strong></td></tr>`,
      )
      .join("")}
  </table>

  <p style="margin-top:32px;color:#4a3526;font-size:13px;">Doručeno ${esc(sentAt)} · AURA Homes Experience</p>
</div>
`.trim();

  const text = [
    `Nová poptávka — ${model.name}`,
    `Cena: ${formatPrice(lead.computedPrice)}`,
    "",
    `Jméno: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Telefon: ${lead.phone}`,
    lead.message ? `\nZpráva:\n${lead.message}` : "",
    "",
    "Konfigurace:",
    ...configRows.map((r) => `  ${r.label}: ${r.value}`),
    "",
    `Doručeno ${sentAt}`,
  ].join("\n");

  const result = await getResend().emails.send({
    from,
    to,
    subject,
    html,
    text,
    replyTo: lead.email,
  });

  if (result.error) {
    throw new Error(`Resend send failed: ${result.error.message ?? "unknown error"}`);
  }
}
