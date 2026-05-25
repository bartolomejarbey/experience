"use client";

import type { ConfigState } from "@/lib/types/config";
import type { ModelId } from "@/lib/types/model";

// v2 — bumped when the configuration schema changed (10 facades, terrace
// gained a 'none' option, pergola removed). Old entries under `aura:config:`
// would otherwise silently keep selecting outdated defaults.
const STORAGE_KEY_PREFIX = "aura:config:v2:";

export function loadConfig(modelId: ModelId): Partial<ConfigState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + modelId);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Partial<ConfigState>;
  } catch {
    return null;
  }
}

export function saveConfig(modelId: ModelId, state: ConfigState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + modelId, JSON.stringify(state));
  } catch {
    /* localStorage quota exceeded or disabled — non-critical */
  }
}
