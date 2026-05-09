import type { ConfigState } from "@/lib/types/config";
import type { Model } from "@/lib/types/model";

export function computePrice(model: Model, state: ConfigState): number {
  let total = model.basePrice;
  for (const cfg of model.configurations) {
    const selectedId = state[cfg.key];
    const option = cfg.options.find((o) => o.id === selectedId);
    if (option) total += option.priceModifier;
  }
  return total;
}
