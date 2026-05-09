"use client";

import { useConfig } from "@/lib/config/useConfig";
import { formatPrice } from "@/lib/format";

export function PriceDisplay() {
  const { price } = useConfig();

  return (
    <div className="flex flex-col gap-1">
      <div className="text-ink-muted font-body text-sm">Cena Vašeho domu</div>
      <div
        className="font-display text-ink text-3xl"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatPrice(price)}
      </div>
      <div className="text-ink-muted font-body text-xs">
        Včetně dopravy a montáže. Bez pozemku.
      </div>
    </div>
  );
}
