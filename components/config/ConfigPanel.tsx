"use client";

import { Button } from "@/components/ui/Button";
import { useConfig } from "@/lib/config/useConfig";

import { ConfigOptionGroup } from "./ConfigOption";
import { PriceDisplay } from "./PriceDisplay";

type ConfigPanelProps = {
  onOpenLeadModal: () => void;
};

export function ConfigPanel({ onOpenLeadModal }: ConfigPanelProps) {
  const { model } = useConfig();

  return (
    <aside className="bg-cream border-brown/10 flex h-full flex-col overflow-y-auto border-l">
      <header className="border-brown/10 border-b p-6">
        <div className="text-ink-muted font-body text-xs tracking-wide uppercase">
          Model
        </div>
        <h1 className="font-display text-ink mt-1 text-3xl">{model.name}</h1>
        <div className="text-ink-muted font-body mt-1 text-sm">
          {model.type} · {model.area} m²
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {model.configurations.map((cfg) => (
          <ConfigOptionGroup key={cfg.key} configuration={cfg} />
        ))}
      </div>

      <footer className="border-brown/10 flex flex-col gap-4 border-t p-6">
        <PriceDisplay />
        <Button variant="primary" size="lg" onClick={onOpenLeadModal} className="w-full">
          Nezávazná poptávka
        </Button>
      </footer>
    </aside>
  );
}
