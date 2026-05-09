"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { ConfigState } from "@/lib/types/config";
import type {
  ConfigOptionId,
  ConfigurationKey,
  Model,
} from "@/lib/types/model";

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

function findExteriorVariant(
  model: Model,
  fromSceneId: string,
  facadeVariant: "dark" | "light",
): string | null {
  const fromScene = model.scenes[fromSceneId];
  if (!fromScene?.exteriorView) return null;
  const target = Object.values(model.scenes).find(
    (s) => s.exteriorView === fromScene.exteriorView && s.facadeVariant === facadeVariant,
  );
  return target?.id ?? null;
}

export function ConfigProvider({
  model,
  children,
}: {
  model: Model;
  children: ReactNode;
}) {
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

    // Facade swap auto-switches the exterior scene to the matching variant.
    if (key === "facade") {
      const facadeOpt = model.configurations
        .find((c) => c.key === "facade")
        ?.options.find((o) => o.id === optionId);
      if (facadeOpt?.facadeVariant) {
        const target = findExteriorVariant(model, currentSceneId, facadeOpt.facadeVariant);
        if (target && target !== currentSceneId) {
          setCurrentSceneId(target);
        }
      }
    }
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
