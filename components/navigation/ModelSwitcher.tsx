"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getAllModels } from "@/lib/scenes";

export function ModelSwitcher() {
  const pathname = usePathname();
  const models = getAllModels();

  return (
    <nav aria-label="Modely AURA" className="flex flex-wrap gap-1">
      {models.map((model) => {
        const href = `/${model.id}`;
        const active = pathname === href;
        const comingSoon = model.status === "coming-soon";

        return (
          <Link
            key={model.id}
            href={href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "rounded-control font-body inline-flex items-center px-3 py-2 text-sm transition-colors",
              "focus-visible:ring-terracotta focus-visible:ring-2 focus-visible:outline-none",
              active ? "bg-ink/90 text-cream" : "text-ink hover:bg-ink/5",
            )}
          >
            <span>{model.name}</span>
            {comingSoon && (
              <span className="text-ink-muted ml-1.5 text-xs">· Brzy</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
