import Link from "next/link";

import { ModelSwitcher } from "./ModelSwitcher";

export function TopBar() {
  return (
    <header className="bg-cream/95 border-brown/10 z-30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-md md:px-6">
      <Link
        href="/"
        className="font-display text-terracotta text-2xl tracking-wider"
        aria-label="AURA Homes — domů"
      >
        AURA
      </Link>
      <ModelSwitcher />
    </header>
  );
}
