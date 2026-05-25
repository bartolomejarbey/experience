import Image from "next/image";
import Link from "next/link";

import { ModelSwitcher } from "./ModelSwitcher";

const AURA_HOMES_URL = "https://aurahomes.cz";

export function TopBar() {
  return (
    <header className="z-30 flex flex-wrap items-center justify-between gap-3 border-b border-brown/10 bg-cream/95 px-4 py-3 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <Link
          href={AURA_HOMES_URL}
          className="-m-1 inline-flex items-center rounded-control p-1 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          aria-label="AURA Homes — zpět na hlavní web"
        >
          <Image
            src="/aura-logo.png"
            alt="AURA Homes"
            width={1226}
            height={994}
            priority
            sizes="56px"
            // Source PNG is red; brightness(0) collapses every visible
            // pixel to pure black while preserving the transparent
            // background.
            className="h-10 w-auto brightness-0"
          />
        </Link>
        <Link
          href={AURA_HOMES_URL}
          className="hidden font-body text-sm text-ink transition-colors hover:text-terracotta sm:inline-flex sm:items-center sm:gap-1"
        >
          <span aria-hidden="true">←</span>
          <span>aurahomes.cz</span>
        </Link>
      </div>
      <ModelSwitcher />
    </header>
  );
}
