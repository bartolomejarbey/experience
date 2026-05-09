"use client";

import "pannellum";
import "pannellum/build/pannellum.css";

import { useEffect, useRef } from "react";

import type { HotSpot, InfoHotSpot, Scene } from "@/lib/types/scene";

import { createInfoDotDom, createSceneArrowDom } from "./hotspots";

type PannellumViewerProps = {
  scenes: Record<string, Scene>;
  currentSceneId: string;
  onSceneChange: (sceneId: string) => void;
  onInfoHotSpotClick: (hotspot: InfoHotSpot, ownerSceneId: string) => void;
  testMode?: boolean;
  className?: string;
};

export default function PannellumViewer({
  scenes,
  currentSceneId,
  onSceneChange,
  onInfoHotSpotClick,
  testMode = false,
  className,
}: PannellumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const lastLoadedSceneRef = useRef<string | null>(null);

  // Latest-callback refs so the imperative DOM listeners attached inside
  // Pannellum's hotspot lifecycle never see stale closures.
  const onSceneChangeRef = useRef(onSceneChange);
  const onInfoHotSpotClickRef = useRef(onInfoHotSpotClick);
  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
  }, [onSceneChange]);
  useEffect(() => {
    onInfoHotSpotClickRef.current = onInfoHotSpotClick;
  }, [onInfoHotSpotClick]);

  // One-time viewer initialization. Re-runs only if the `scenes` object
  // identity changes (i.e. the user switches model). Scene swaps within
  // a model go through the `loadScene` effect below.
  useEffect(() => {
    if (testMode) return;
    if (typeof window === "undefined") return;
    const pannellum = window.pannellum;
    const container = containerRef.current;
    if (!pannellum || !container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeDuration = reduced ? 0 : 1000;

    const pannellumScenes: Record<string, PannellumSceneConfig> = {};
    for (const [sceneId, scene] of Object.entries(scenes)) {
      pannellumScenes[sceneId] = {
        type: "equirectangular",
        panorama: scene.panorama,
        hfov: scene.hfov,
        pitch: scene.pitch,
        yaw: scene.yaw,
        sceneFadeDuration: fadeDuration,
        hotSpots: scene.hotSpots.map((h) =>
          buildHotSpot(h, sceneId, onSceneChangeRef, onInfoHotSpotClickRef),
        ),
      };
    }

    const viewer = pannellum.viewer(container, {
      autoLoad: true,
      showControls: false,
      mouseZoom: true,
      draggable: true,
      crossOrigin: "anonymous",
      orientationOnByDefault: false,
      sceneFadeDuration: fadeDuration,
      backgroundColor: [0.1, 0.087, 0.071],
      default: { firstScene: currentSceneId, sceneFadeDuration: fadeDuration },
      scenes: pannellumScenes,
    });

    viewerRef.current = viewer;
    lastLoadedSceneRef.current = currentSceneId;

    return () => {
      try {
        viewer.destroy();
      } catch {
        /* viewer already torn down */
      }
      viewerRef.current = null;
      lastLoadedSceneRef.current = null;
    };
    // currentSceneId intentionally excluded — handled by the effect below.
  }, [scenes, testMode]);

  // Reflect parent-driven scene changes into the existing viewer.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (lastLoadedSceneRef.current === currentSceneId) return;
    try {
      viewer.loadScene(currentSceneId);
      lastLoadedSceneRef.current = currentSceneId;
    } catch (err) {
      // Pannellum throws synchronously if the sceneId is unknown.
      console.error("[PannellumViewer] loadScene failed:", err);
    }
  }, [currentSceneId]);

  if (testMode) {
    return (
      <div
        ref={containerRef}
        className={className}
        data-testid="pannellum-test"
        aria-label="Náhled panorama (testovací režim)"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      role="application"
      aria-label="Interaktivní 360° prohlídka"
    />
  );
}

function buildHotSpot(
  hotspot: HotSpot,
  ownerSceneId: string,
  onSceneChangeRef: React.RefObject<(id: string) => void>,
  onInfoClickRef: React.RefObject<(h: InfoHotSpot, sceneId: string) => void>,
): PannellumHotSpot {
  if (hotspot.type === "scene") {
    return {
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      type: "info",
      cssClass: "aura-hotspot aura-hotspot--scene",
      createTooltipFunc: createSceneArrowDom,
      createTooltipArgs: { hotspot, onSceneChangeRef },
    };
  }
  return {
    pitch: hotspot.pitch,
    yaw: hotspot.yaw,
    type: "info",
    cssClass: "aura-hotspot aura-hotspot--info",
    createTooltipFunc: createInfoDotDom,
    createTooltipArgs: { hotspot, ownerSceneId, onInfoClickRef },
  };
}
