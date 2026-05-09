"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { ConfigPanel } from "@/components/config/ConfigPanel";
import { MobileDrawer } from "@/components/config/MobileDrawer";
import { LeadCaptureModal } from "@/components/lead/LeadCaptureModal";
import { MiniMap } from "@/components/navigation/MiniMap";
import { ConfigProvider } from "@/lib/config/ConfigContext";
import { useConfig } from "@/lib/config/useConfig";
import type { Model } from "@/lib/types/model";
import type { InfoHotSpot } from "@/lib/types/scene";

import { InfoHotspotDialog } from "./InfoHotspotDialog";

const PannellumViewer = dynamic(() => import("@/components/pannellum/PannellumViewer"), {
  ssr: false,
  loading: () => (
    <div className="bg-ink text-cream/60 font-body flex h-full w-full items-center justify-center">
      Načítání 360° prohlídky…
    </div>
  ),
});

export function ModelExperience({ model }: { model: Model }) {
  return (
    <ConfigProvider model={model}>
      <ExperienceShell />
    </ConfigProvider>
  );
}

function ExperienceShell() {
  const { model, currentSceneId, setCurrentSceneId } = useConfig();
  const [leadOpen, setLeadOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState<InfoHotSpot | null>(null);

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-[1fr_22rem]">
      <div className="bg-ink relative h-full overflow-hidden">
        <PannellumViewer
          scenes={model.scenes}
          currentSceneId={currentSceneId}
          onSceneChange={setCurrentSceneId}
          onInfoHotSpotClick={(hs) => setActiveInfo(hs)}
          className="absolute inset-0 h-full w-full"
        />
        <div className="pointer-events-none absolute bottom-4 left-4 hidden md:block">
          <div className="pointer-events-auto">
            <MiniMap />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <ConfigPanel onOpenLeadModal={() => setLeadOpen(true)} />
      </div>

      <MobileDrawer onOpenLeadModal={() => setLeadOpen(true)} />

      <LeadCaptureModal open={leadOpen} onClose={() => setLeadOpen(false)} />

      <InfoHotspotDialog hotspot={activeInfo} onClose={() => setActiveInfo(null)} />
    </div>
  );
}
