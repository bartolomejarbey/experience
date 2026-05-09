"use client";

import clsx from "clsx";

import { useConfig } from "@/lib/config/useConfig";
import { formatPrice } from "@/lib/format";
import type { Configuration } from "@/lib/types/model";

type ConfigOptionGroupProps = {
  configuration: Configuration;
};

export function ConfigOptionGroup({ configuration }: ConfigOptionGroupProps) {
  const { state, setOption } = useConfig();
  const selectedId = state[configuration.key];
  const labelId = `aura-config-${configuration.key}-label`;

  return (
    <div className="flex flex-col gap-2" role="group" aria-labelledby={labelId}>
      <div id={labelId} className="font-body text-ink-muted text-sm">
        {configuration.labelCs}
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={labelId}>
        {configuration.options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setOption(configuration.key, option.id)}
              className={clsx(
                "rounded-control border px-4 py-2 text-sm transition-colors",
                "focus-visible:ring-terracotta focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                selected
                  ? "bg-ink border-ink text-cream"
                  : "bg-cream text-ink border-brown/20 hover:border-brown/40",
              )}
            >
              <span className="font-body">{option.labelCs}</span>
              {option.priceModifier !== 0 && (
                <span
                  className={clsx(
                    "ml-2 text-xs",
                    selected ? "text-cream/70" : "text-ink-muted",
                  )}
                >
                  {formatPriceDelta(option.priceModifier)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatPriceDelta(amount: number): string {
  const sign = amount > 0 ? "+" : "−";
  return `${sign} ${formatPrice(Math.abs(amount))}`;
}
