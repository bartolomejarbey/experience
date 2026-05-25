import type { ConfigState } from "@/lib/types/config";
import type { Configuration, Model } from "@/lib/types/model";

export type ConfigLine = {
  key: string;
  label: string;
  value: string;
  priceModifier: number;
};

export type PdfSummary = {
  model: Model;
  state: ConfigState;
  /** Selected option per configuration, resolved to human labels. */
  lines: ConfigLine[];
  basePrice: number;
  totalPrice: number;
  /** Czech-locale long date string (`21. května 2026`). */
  generatedOn: string;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("cs-CZ", { dateStyle: "long" });

export function buildPdfSummary(model: Model, state: ConfigState): PdfSummary {
  const lines: ConfigLine[] = [];
  let total = model.basePrice;

  for (const cfg of model.configurations) {
    const selectedId = state[cfg.key];
    const option = cfg.options.find((o) => o.id === selectedId);
    if (!option) continue;
    total += option.priceModifier;
    lines.push({
      key: cfg.key,
      label: cfg.labelCs,
      value: option.labelCs,
      priceModifier: option.priceModifier,
    });
  }

  return {
    model,
    state,
    lines,
    basePrice: model.basePrice,
    totalPrice: total,
    generatedOn: DATE_FORMATTER.format(new Date()),
  };
}

/** Parse and validate ?facade=...&terrace=... query into a ConfigState.
 *  Unknown / missing keys fall back to each configuration's default option. */
export function resolveConfigFromQuery(
  model: Model,
  params: URLSearchParams,
): ConfigState {
  const state = {} as ConfigState;
  for (const cfg of model.configurations) {
    const raw = params.get(cfg.key);
    const valid = raw && cfg.options.some((o) => o.id === raw);
    state[cfg.key as keyof ConfigState] = (valid ? raw : cfg.defaultOptionId) as
      ConfigState[keyof ConfigState];
  }
  return state;
}

/** Inverse helper: build a `?facade=…&terrace=…` query string from state,
 *  so the client can link directly to the PDF. */
export function configStateToQuery(state: ConfigState): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(state)) {
    params.set(k, v);
  }
  return params.toString();
}

// Imported lazily on the client where this is needed.
export type { Configuration };
