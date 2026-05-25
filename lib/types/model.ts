import type { Scene } from "./scene";

export const MODEL_IDS = ["luma", "terra", "silva", "mare"] as const;
export type ModelId = (typeof MODEL_IDS)[number];

export const CONFIGURATION_KEYS = ["facade", "terrace"] as const;
export type ConfigurationKey = (typeof CONFIGURATION_KEYS)[number];

export type ConfigOptionId = string;

export type ConfigOption = {
  id: ConfigOptionId;
  labelCs: string;
  priceModifier: number;
};

export type Configuration = {
  key: ConfigurationKey;
  labelCs: string;
  defaultOptionId: ConfigOptionId;
  options: ConfigOption[];
};

export type ModelStatus = "available" | "coming-soon";

export type ModelSpec = {
  label: string;
  value: string;
};

export type ModelInfo = {
  /** Single-sentence positioning line shown above the long description. */
  tagline?: string;
  /** Longer prose description, displayed in the info dialog and PDF. */
  description: string;
  /** Short bullet list of the strongest selling points. */
  highlights: string[];
  /** Hard technical specs (rooms, energy class, foundation, …). */
  specs: ModelSpec[];
  /** Standard materials shipped with the model. */
  materials: ModelSpec[];
};

export type Model = {
  id: ModelId;
  name: string;
  type: string;
  area: number;
  basePrice: number;
  currency: "CZK";
  status: ModelStatus;
  configurations: Configuration[];
  scenes: Record<string, Scene>;
  defaultSceneId: string;
  info?: ModelInfo;
};

export function isModelId(value: string): value is ModelId {
  return (MODEL_IDS as readonly string[]).includes(value);
}
