"use server";

import type { z } from "zod";

import { sendLeadNotification } from "@/lib/email/notify";
import { getModelById } from "@/lib/scenes";
import { getServerSupabase } from "@/lib/supabase/server";
import { isModelId } from "@/lib/types/model";
import {
  LeadSchema,
  type LeadFieldErrors,
  type LeadFormState,
} from "@/lib/types/lead";

const GENERIC_ERROR =
  "Něco se pokazilo. Zkuste to prosím znovu nebo nám napište na info@aurahomes.cz.";

const HONEYPOT_FIELD = "website";
const CONFIG_PREFIX = "config:";

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot — bots cheerfully fill hidden inputs; humans never see this one.
  const honeypot = String(formData.get(HONEYPOT_FIELD) ?? "");
  if (honeypot.length > 0) {
    return { status: "success" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
    modelId: String(formData.get("modelId") ?? ""),
    configuration: parseConfiguration(formData),
    computedPrice: Number(formData.get("computedPrice") ?? 0),
  };

  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Některé údaje nejsou ve správném formátu. Zkontrolujte prosím vyplněná pole.",
      fieldErrors: zodErrorsToFieldErrors(parsed.error),
    };
  }

  const lead = parsed.data;

  if (!isModelId(lead.modelId)) {
    return { status: "error", message: GENERIC_ERROR };
  }
  const model = getModelById(lead.modelId);

  // Persist first — DB is the source of truth. Email is supplementary.
  try {
    const supabase = getServerSupabase();
    const { error: dbError } = await supabase.from("aura_leads").insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      model_id: lead.modelId,
      configuration: lead.configuration,
      computed_price: lead.computedPrice,
    });

    if (dbError) {
      console.error("[submitLead] Supabase insert failed:", dbError);
      return { status: "error", message: GENERIC_ERROR };
    }
  } catch (err) {
    console.error("[submitLead] Supabase exception:", err);
    return { status: "error", message: GENERIC_ERROR };
  }

  // Notification: best-effort. Lead is already saved.
  try {
    await sendLeadNotification(lead, model);
  } catch (err) {
    console.error("[submitLead] Email notification failed:", err);
  }

  return { status: "success" };
}

function parseConfiguration(fd: FormData): Record<string, string> {
  const config: Record<string, string> = {};
  for (const [key, value] of fd.entries()) {
    if (key.startsWith(CONFIG_PREFIX)) {
      config[key.slice(CONFIG_PREFIX.length)] = String(value);
    }
  }
  return config;
}

function zodErrorsToFieldErrors(error: z.ZodError): LeadFieldErrors {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !result[key]) {
      result[key] = issue.message;
    }
  }
  return result as LeadFieldErrors;
}
