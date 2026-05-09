"use client";

import clsx from "clsx";
import { useMemo } from "react";

import { useConfig } from "@/lib/config/useConfig";
import type { Model } from "@/lib/types/model";
import type { Scene } from "@/lib/types/scene";

type MapEntry = {
  representativeId: string;
  label: string;
  exteriorView?: string;
};

function buildEntries(model: Model): MapEntry[] {
  const entries: MapEntry[] = [];
  const seenExterior = new Set<string>();

  for (const scene of Object.values(model.scenes)) {
    if (scene.exteriorView) {
      if (seenExterior.has(scene.exteriorView)) continue;
      seenExterior.add(scene.exteriorView);
      entries.push({
        representativeId: scene.id,
        label: "Exteriér",
        exteriorView: scene.exteriorView,
      });
    } else {
      entries.push({
        representativeId: scene.id,
        label: scene.title,
      });
    }
  }
  return entries;
}

function isEntryActive(entry: MapEntry, currentSceneId: string, scenes: Record<string, Scene>) {
  if (!entry.exteriorView) return entry.representativeId === currentSceneId;
  const current = scenes[currentSceneId];
  return current?.exteriorView === entry.exteriorView;
}

export function MiniMap() {
  const { model, state, currentSceneId, setCurrentSceneId } = useConfig();
  const entries = useMemo(() => buildEntries(model), [model]);

  const handleNavigate = (entry: MapEntry) => {
    if (!entry.exteriorView) {
      setCurrentSceneId(entry.representativeId);
      return;
    }
    // Honour the user's current facade choice when entering the exterior.
    const facadeOpt = model.configurations
      .find((c) => c.key === "facade")
      ?.options.find((o) => o.id === state.facade);
    const target = Object.values(model.scenes).find(
      (s) =>
        s.exteriorView === entry.exteriorView &&
        s.facadeVariant === facadeOpt?.facadeVariant,
    );
    setCurrentSceneId(target?.id ?? entry.representativeId);
  };

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="Místnosti modelu"
      className="bg-cream/95 rounded-card border-brown/10 max-w-[14rem] border p-2 shadow-lg backdrop-blur-md"
    >
      <ul className="flex flex-col gap-0.5">
        {entries.map((entry) => {
          const active = isEntryActive(entry, currentSceneId, model.scenes);
          return (
            <li key={entry.representativeId}>
              <button
                type="button"
                onClick={() => handleNavigate(entry)}
                aria-current={active ? "true" : undefined}
                className={clsx(
                  "rounded-control font-body w-full px-3 py-1.5 text-left text-sm transition-colors",
                  "focus-visible:ring-terracotta focus-visible:ring-2 focus-visible:outline-none",
                  active ? "bg-ink text-cream" : "text-ink hover:bg-ink/5",
                )}
              >
                {entry.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
