"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { ConfigState } from "@/lib/types/config";
import type { ConfigOptionId, ConfigurationKey, Model } from "@/lib/types/model";

import { loadConfig, saveConfig } from "./persistence";
import { computePrice } from "./price";

type ConfigContextValue = {
  model: Model;
  state: ConfigState;
  setOption: (key: ConfigurationKey, optionId: ConfigOptionId) => void;
  currentSceneId: string;
  setCurrentSceneId: (id: string) => void;
  price: number;
};

export const ConfigContext = createContext<ConfigContextValue | null>(null);

function defaultState(model: Model): ConfigState {
  const obj = {} as ConfigState;
  for (const cfg of model.configurations) {
    obj[cfg.key] = cfg.defaultOptionId;
  }
  return obj;
}

export function ConfigProvider({ model, children }: { model: Model; children: ReactNode }) {
  const [state, setState] = useState<ConfigState>(() => defaultState(model));
  const [currentSceneId, setCurrentSceneId] = useState<string>(model.defaultSceneId);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on client mount.
  useEffect(() => {
    const saved = loadConfig(model.id);
    if (saved) {
      setState((prev) => {
        const next: ConfigState = { ...prev };
        for (const cfg of model.configurations) {
          const savedOptionId = saved[cfg.key];
          if (savedOptionId && cfg.options.some((o) => o.id === savedOptionId)) {
            next[cfg.key] = savedOptionId;
          }
        }
        return next;
      });
    }
    setHydrated(true);
  }, [model]);

  // Persist after hydration so we never overwrite saved state with defaults.
  useEffect(() => {
    if (!hydrated) return;
    saveConfig(model.id, state);
  }, [model.id, state, hydrated]);

  const setOption = (key: ConfigurationKey, optionId: ConfigOptionId) => {
    setState((prev) => ({ ...prev, [key]: optionId }));
    // The orbit viewer re-derives its frame URLs from config state directly,
    // so facade / pergola changes no longer require a scene swap here.
  };

  const price = useMemo(() => computePrice(model, state), [model, state]);

  const value: ConfigContextValue = {
    model,
    state,
    setOption,
    currentSceneId,
    setCurrentSceneId,
    price,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
