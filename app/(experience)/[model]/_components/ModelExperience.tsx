"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { ConfigPanel } from "@/components/config/ConfigPanel";
import { MobileDrawer } from "@/components/config/MobileDrawer";
import { LeadCaptureModal } from "@/components/lead/LeadCaptureModal";
import { MiniMap } from "@/components/navigation/MiniMap";
import { ConfigProvider } from "@/lib/config/ConfigContext";
import { useConfig } from "@/lib/config/useConfig";
import { resolveOrbitVariantKey } from "@/lib/scenes/orbit-variant";
import { buildOrbitFrameUrls } from "@/lib/supabase/public-url";
import type { Model } from "@/lib/types/model";
import type { InfoHotSpot, OrbitScene, PanoramaScene, SceneHotSpot } from "@/lib/types/scene";

import { InfoHotspotDialog } from "./InfoHotspotDialog";

const PannellumViewer = dynamic(() => import("@/components/pannellum/PannellumViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink font-body text-cream/60">
      Načítání 360° prohlídky…
    </div>
  ),
});

const OrbitViewer = dynamic(() => import("@/components/orbit/OrbitViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink font-body text-cream/60">
      Načítání orbit prohlídky…
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

  const currentScene = model.scenes[currentSceneId];

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-[1fr_22rem]">
      <div className="relative h-full overflow-hidden bg-ink">
        {currentScene?.type === "orbit" ? (
          <OrbitSceneView
            scene={currentScene}
            modelId={model.id}
            onSceneChange={setCurrentSceneId}
            onInfoHotSpotClick={setActiveInfo}
          />
        ) : (
          <PanoramaSceneView
            model={model}
            currentSceneId={currentSceneId}
            onSceneChange={setCurrentSceneId}
            onInfoHotSpotClick={setActiveInfo}
          />
        )}

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

function PanoramaSceneView({
  model,
  currentSceneId,
  onSceneChange,
  onInfoHotSpotClick,
}: {
  model: Model;
  currentSceneId: string;
  onSceneChange: (id: string) => void;
  onInfoHotSpotClick: (h: InfoHotSpot) => void;
}) {
  // Pannellum only handles panorama scenes — narrow the registry once.
  const panoramaScenes = useMemo(() => {
    const out: Record<string, PanoramaScene> = {};
    for (const scene of Object.values(model.scenes)) {
      if (scene.type === "panorama") out[scene.id] = scene;
    }
    return out;
  }, [model]);

  return (
    <PannellumViewer
      scenes={panoramaScenes}
      currentSceneId={currentSceneId}
      onSceneChange={onSceneChange}
      onInfoHotSpotClick={(hs) => onInfoHotSpotClick(hs)}
      className="absolute inset-0 h-full w-full"
    />
  );
}

function OrbitSceneView({
  scene,
  modelId,
  onSceneChange,
  onInfoHotSpotClick,
}: {
  scene: OrbitScene;
  modelId: Model["id"];
  onSceneChange: (id: string) => void;
  onInfoHotSpotClick: (h: InfoHotSpot) => void;
}) {
  const { state } = useConfig();

  const variantKey = useMemo(
    () => resolveOrbitVariantKey(state, scene.variantKeys),
    [state, scene.variantKeys],
  );

  const frames = useMemo(
    () => buildOrbitFrameUrls(modelId, scene.sceneFolder, variantKey, scene.frameCount),
    [modelId, scene.sceneFolder, scene.frameCount, variantKey],
  );

  const handleSceneHotSpot = (hs: SceneHotSpot) => onSceneChange(hs.targetSceneId);

  return (
    <OrbitViewer
      frames={frames}
      startFrame={scene.startFrame}
      hotSpots={scene.hotSpots}
      onSceneHotSpotClick={handleSceneHotSpot}
      onInfoHotSpotClick={onInfoHotSpotClick}
      className="absolute inset-0 h-full w-full"
    />
  );
}
