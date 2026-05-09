import type { Scene } from "./scene";

export const MODEL_IDS = ["luma", "terra", "silva", "mare"] as const;
export type ModelId = (typeof MODEL_IDS)[number];

export const CONFIGURATION_KEYS = ["facade", "terrace", "pergola"] as const;
export type ConfigurationKey = (typeof CONFIGURATION_KEYS)[number];

export type ConfigOptionId = string;

export type ConfigOption = {
  id: ConfigOptionId;
  labelCs: string;
  priceModifier: number;
  facadeVariant?: "dark" | "light";
};

export type Configuration = {
  key: ConfigurationKey;
  labelCs: string;
  defaultOptionId: ConfigOptionId;
  options: ConfigOption[];
};

export type ModelStatus = "available" | "coming-soon";

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
};

export function isModelId(value: string): value is ModelId {
  return (MODEL_IDS as readonly string[]).includes(value);
}
