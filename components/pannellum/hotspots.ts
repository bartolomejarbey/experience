import type { RefObject } from "react";
import type { InfoHotSpot, SceneHotSpot } from "@/lib/types/scene";

type SceneArrowArgs = {
  hotspot: SceneHotSpot;
  onSceneChangeRef: RefObject<(id: string) => void>;
};

type InfoDotArgs = {
  hotspot: InfoHotSpot;
  ownerSceneId: string;
  onInfoClickRef: RefObject<(h: InfoHotSpot, sceneId: string) => void>;
};

const SCENE_ARROW_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">' +
  '<path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" stroke-width="2" fill="none" ' +
  'stroke-linecap="round" stroke-linejoin="round"/></svg>';

const INFO_GLYPH = '<span aria-hidden="true">i</span>';

export function createSceneArrowDom(div: HTMLElement, args: unknown): void {
  const { hotspot, onSceneChangeRef } = args as SceneArrowArgs;

  div.setAttribute("role", "button");
  div.setAttribute("tabindex", "0");
  div.setAttribute("aria-label", hotspot.labelCs);
  div.innerHTML = SCENE_ARROW_SVG;

  const trigger = (e: Event) => {
    e.stopPropagation();
    onSceneChangeRef.current(hotspot.targetSceneId);
  };

  div.addEventListener("click", trigger);
  div.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      trigger(e);
    }
  });
}

export function createInfoDotDom(div: HTMLElement, args: unknown): void {
  const { hotspot, ownerSceneId, onInfoClickRef } = args as InfoDotArgs;

  div.setAttribute("role", "button");
  div.setAttribute("tabindex", "0");
  div.setAttribute("aria-label", hotspot.titleCs);
  div.innerHTML = INFO_GLYPH;

  const trigger = (e: Event) => {
    e.stopPropagation();
    onInfoClickRef.current(hotspot, ownerSceneId);
  };

  div.addEventListener("click", trigger);
  div.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      trigger(e);
    }
  });
}
