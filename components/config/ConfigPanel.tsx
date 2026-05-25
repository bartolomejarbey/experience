"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useConfig } from "@/lib/config/useConfig";

import { ConfigOptionGroup } from "./ConfigOption";
import { ModelInfoDialog } from "./ModelInfoDialog";
import { PdfDownloadButton } from "./PdfDownloadButton";
import { PriceDisplay } from "./PriceDisplay";

type ConfigPanelProps = {
  onOpenLeadModal: () => void;
};

export function ConfigPanel({ onOpenLeadModal }: ConfigPanelProps) {
  const { model } = useConfig();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-l border-brown/10 bg-cream">
      <header className="flex items-start justify-between gap-3 border-b border-brown/10 p-6">
        <div>
          <div className="font-body text-xs tracking-wide text-ink-muted uppercase">Model</div>
          <h1 className="mt-1 font-display text-3xl text-ink">{model.name}</h1>
          <div className="mt-1 font-body text-sm text-ink-muted">
            {model.type} · {model.area} m²
          </div>
        </div>
        <Button
          variant="icon"
          size="md"
          onClick={() => setInfoOpen(true)}
          aria-label="Informace o modelu"
          title="Informace o modelu"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="12" y1="7.5" x2="12" y2="7.5" />
          </svg>
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {model.configurations.map((cfg) => (
          <ConfigOptionGroup key={cfg.key} configuration={cfg} />
        ))}
      </div>

      <footer className="flex flex-col gap-3 border-t border-brown/10 p-6">
        <PriceDisplay />
        <Button variant="primary" size="lg" onClick={onOpenLeadModal} className="w-full">
          Nezávazná poptávka
        </Button>
        <PdfDownloadButton />
      </footer>

      <ModelInfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} model={model} />
    </aside>
  );
}
