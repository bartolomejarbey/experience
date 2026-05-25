import type { ConfigState } from "@/lib/types/config";
import type { ConfigurationKey } from "@/lib/types/model";

/** Map the selected config option-ids into a stable folder-name suffix that
 *  matches the Supabase storage layout, e.g. `["facade","pergola"]`
 *  with state `{facade:"dark", pergola:"no"}` → `"dark-no"`. */
export function resolveOrbitVariantKey(
  state: ConfigState,
  variantKeys: ConfigurationKey[],
): string {
  return variantKeys.map((key) => state[key]).join("-");
}
