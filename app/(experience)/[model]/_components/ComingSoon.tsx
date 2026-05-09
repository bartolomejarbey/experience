import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { Model } from "@/lib/types/model";

export function ComingSoon({ model }: { model: Model }) {
  return (
    <div className="bg-cream text-ink flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="text-ink-muted font-body text-xs tracking-wide uppercase">
        Připravujeme
      </div>
      <h1 className="font-display mt-2 text-5xl md:text-6xl">{model.name}</h1>
      <div className="text-ink-muted font-body mt-2">
        {model.type} · {model.area} m²
      </div>
      <div className="font-display text-terracotta mt-6 text-3xl">
        od {formatPrice(model.basePrice)}
      </div>
      <p className="text-ink-muted font-body mt-6 max-w-md leading-relaxed">
        Interaktivní prohlídku modelu {model.name} chystáme pro další iteraci.
        Zatím si můžete projít náš pilotní model Luma.
      </p>
      <Link
        href="/luma"
        className="rounded-control bg-terracotta text-cream font-body hover:bg-terracotta-soft mt-8 px-6 py-3 transition-colors"
      >
        Otevřít model Luma
      </Link>
    </div>
  );
}
