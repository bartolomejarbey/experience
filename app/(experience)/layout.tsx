import type { ReactNode } from "react";

import { TopBar } from "@/components/navigation/TopBar";

export default function ExperienceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <TopBar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
