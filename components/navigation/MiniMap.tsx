"use client";

import clsx from "clsx";
import { useMemo } from "react";

import { useConfig } from "@/lib/config/useConfig";
import type { Model } from "@/lib/types/model";

type MapEntry = {
  sceneId: string;
  label: string;
};

function buildEntries(model: Model): MapEntry[] {
  const entries: MapEntry[] = [];
  for (const scene of Object.values(model.scenes)) {
    entries.push({
      sceneId: scene.id,
      label: scene.type === "orbit" ? "Exteriér" : scene.title,
    });
  }
  return entries;
}

export function MiniMap() {
  const { model, currentSceneId, setCurrentSceneId } = useConfig();
  const entries = useMemo(() => buildEntries(model), [model]);

  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="Místnosti modelu"
      className="max-w-[14rem] rounded-card border border-brown/10 bg-cream/95 p-2 shadow-lg backdrop-blur-md"
    >
      <ul className="flex flex-col gap-0.5">
        {entries.map((entry) => {
          const active = entry.sceneId === currentSceneId;
          return (
            <li key={entry.sceneId}>
              <button
                type="button"
                onClick={() => setCurrentSceneId(entry.sceneId)}
                aria-current={active ? "true" : undefined}
                className={clsx(
                  "w-full rounded-control px-3 py-1.5 text-left font-body text-sm transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none",
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
