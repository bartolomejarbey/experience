import { z } from "zod";
import { MODEL_IDS } from "./model";

export const LeadSchema = z.object({
  name: z.string().trim().min(2, "Vyplňte prosím Vaše jméno (alespoň 2 znaky)."),
  email: z.string().trim().email("E-mail musí obsahovat zavináč (@) a doménu."),
  phone: z
    .string()
    .trim()
    .min(9, "Telefon zadejte včetně předvolby, např. +420 777 123 456."),
  message: z
    .string()
    .trim()
    .max(2000, "Zpráva je příliš dlouhá (maximálně 2000 znaků).")
    .optional()
    .default(""),
  modelId: z.enum(MODEL_IDS),
  configuration: z.record(z.string(), z.string()),
  computedPrice: z.number().int().positive(),
  website: z.string().max(0).optional().default(""),
});

export type Lead = z.infer<typeof LeadSchema>;

export type LeadFieldErrors = Partial<Record<keyof Lead, string>>;

export type LeadFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: LeadFieldErrors;
    };

export const LEAD_FORM_INITIAL_STATE: LeadFormState = { status: "idle" };
