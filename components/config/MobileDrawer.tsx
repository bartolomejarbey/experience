"use client";

import clsx from "clsx";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useConfig } from "@/lib/config/useConfig";
import { formatPrice } from "@/lib/format";

import { ConfigOptionGroup } from "./ConfigOption";
import { ModelInfoDialog } from "./ModelInfoDialog";
import { PdfDownloadButton } from "./PdfDownloadButton";

type MobileDrawerProps = {
  onOpenLeadModal: () => void;
};

const COLLAPSED_PEEK = "8rem"; // px showing above viewport bottom when collapsed
const DRAWER_HEIGHT = "85vh";

export function MobileDrawer({ onOpenLeadModal }: MobileDrawerProps) {
  const { model, price } = useConfig();
  const [expanded, setExpanded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      {expanded && (
        <button
          type="button"
          aria-label="Zavřít konfigurátor"
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
        />
      )}

      <div
        className={clsx(
          "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-card bg-cream md:hidden",
          "shadow-[0_-4px_24px_rgba(26,22,18,0.15)]",
        )}
        style={{
          height: DRAWER_HEIGHT,
          transform: expanded
            ? "translateY(0)"
            : `translateY(calc(${DRAWER_HEIGHT} - ${COLLAPSED_PEEK}))`,
          transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        role="region"
        aria-label="Konfigurátor"
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="aura-drawer-body"
          className="flex w-full flex-col items-stretch px-6 pt-3 pb-2"
        >
          <span className="mx-auto block h-1 w-12 rounded-full bg-brown/30" aria-hidden="true" />
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-left">
              <div className="font-display text-2xl text-ink">{model.name}</div>
              <div className="font-body text-xs text-ink-muted">{model.type}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-ink-muted">Cena</div>
              <div className="font-display text-xl text-ink" aria-live="polite" aria-atomic="true">
                {formatPrice(price)}
              </div>
            </div>
          </div>
        </button>

        <div
          id="aura-drawer-body"
          className="flex-1 overflow-y-auto px-6 pb-6"
          aria-hidden={!expanded}
        >
          <div className="flex flex-col gap-6 py-4">
            {model.configurations.map((cfg) => (
              <ConfigOptionGroup key={cfg.key} configuration={cfg} />
            ))}
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setExpanded(false);
                onOpenLeadModal();
              }}
              className="w-full"
            >
              Nezávazná poptávka
            </Button>
            <PdfDownloadButton />
            <Button variant="ghost" size="md" onClick={() => setInfoOpen(true)} className="w-full">
              Informace o modelu
            </Button>
          </div>
        </div>
      </div>

      <ModelInfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} model={model} />
    </>
  );
}
