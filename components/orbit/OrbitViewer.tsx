"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  InfoHotSpot,
  OrbitHotSpot,
  SceneHotSpot,
} from "@/lib/types/scene";

type OrbitViewerProps = {
  /** Ordered list of frame URLs that compose the full loop. */
  frames: string[];
  /** Frame index to render first (0 = first frame). */
  startFrame?: number;
  /** Overlay hotspots — info dialogs and scene transitions. */
  hotSpots?: OrbitHotSpot[];
  onSceneHotSpotClick?: (hotspot: SceneHotSpot) => void;
  onInfoHotSpotClick?: (hotspot: InfoHotSpot) => void;
  /** Pixels of horizontal drag that advances by one frame. Lower = more
   *  sensitive. */
  dragPixelsPerFrame?: number;
  /** Bypass DOM rendering for tests / SSR-shells. */
  testMode?: boolean;
  className?: string;
};

/** Drag-scrub orbit viewer. Frames are preloaded once; the user drags left
 *  or right (mouse or touch) to spin the building. The loop wraps so it
 *  always feels seamless. */
export default function OrbitViewer({
  frames,
  startFrame = 0,
  hotSpots = [],
  onSceneHotSpotClick,
  onInfoHotSpotClick,
  dragPixelsPerFrame = 16,
  testMode = false,
  className,
}: OrbitViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(() =>
    wrap(startFrame, frames.length),
  );
  const [loaded, setLoaded] = useState(0);

  // ─── Frame preload ──────────────────────────────────────────
  useEffect(() => {
    if (testMode) return;
    if (typeof window === "undefined") return;
    if (frames.length === 0) return;

    setLoaded(0);
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];

    for (const src of frames) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        setLoaded((n) => n + 1);
      };
      img.onerror = () => {
        if (cancelled) return;
        // Treat failed frame as "loaded" so the UI never gets stuck — the
        // viewer falls back to whichever sibling frame the browser caches.
        setLoaded((n) => n + 1);
      };
      imgs.push(img);
    }

    return () => {
      cancelled = true;
      for (const img of imgs) {
        img.onload = null;
        img.onerror = null;
      }
    };
  }, [frames, testMode]);

  // Reset frame index when the variant changes (new `frames` reference).
  useEffect(() => {
    setFrameIndex(wrap(startFrame, frames.length));
  }, [frames, startFrame]);

  // ─── Drag handling ──────────────────────────────────────────
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startFrame: number;
  } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on hotspot buttons (they bubble up here).
    if ((e.target as HTMLElement).closest("[data-orbit-hotspot]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startFrame: frameIndex,
    };
  }, [frameIndex]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      const dx = e.clientX - drag.startX;
      const delta = Math.round(dx / dragPixelsPerFrame);
      // Dragging right reveals the LEFT side of the building → advance the
      // frame backwards so motion direction matches the user's hand.
      const next = wrap(drag.startFrame - delta, frames.length);
      setFrameIndex(next);
    },
    [dragPixelsPerFrame, frames.length],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* release can throw if the capture was already lost */
    }
    dragRef.current = null;
  }, []);

  // Keyboard accessibility: arrow keys nudge one frame at a time.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFrameIndex((i) => wrap(i - 1, frames.length));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setFrameIndex((i) => wrap(i + 1, frames.length));
      }
    },
    [frames.length],
  );

  // ─── Hotspots visible on the current frame ──────────────────
  const activeHotSpots = useMemo(
    () => hotSpots.filter((h) => isFrameInRange(frameIndex, h.framesVisible)),
    [hotSpots, frameIndex],
  );

  if (testMode) {
    return (
      <div
        ref={containerRef}
        className={className}
        data-testid="orbit-test"
        aria-label="Orbit prohlídka (testovací režim)"
      />
    );
  }

  const allLoaded = frames.length > 0 && loaded >= frames.length;
  const currentSrc = frames[frameIndex];

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative h-full w-full select-none overflow-hidden bg-ink",
        "touch-pan-y",
        className,
      )}
      role="application"
      aria-label="Interaktivní orbit prohlídka domu"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{ cursor: dragRef.current ? "grabbing" : "grab" }}
    >
      {currentSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : null}

      {!allLoaded ? (
        <div
          aria-live="polite"
          className="text-cream/70 font-body absolute inset-0 flex items-center justify-center text-sm"
        >
          Načítání orbit prohlídky… {Math.round((loaded / Math.max(frames.length, 1)) * 100)} %
        </div>
      ) : null}

      {activeHotSpots.map((h) => (
        <OrbitHotSpotButton
          key={h.id}
          hotspot={h}
          onSceneClick={onSceneHotSpotClick}
          onInfoClick={onInfoHotSpotClick}
        />
      ))}
    </div>
  );
}

function OrbitHotSpotButton({
  hotspot,
  onSceneClick,
  onInfoClick,
}: {
  hotspot: OrbitHotSpot;
  onSceneClick?: (h: SceneHotSpot) => void;
  onInfoClick?: (h: InfoHotSpot) => void;
}) {
  const isScene = hotspot.type === "scene";
  return (
    <button
      type="button"
      data-orbit-hotspot
      aria-label={isScene ? hotspot.labelCs : hotspot.titleCs}
      onClick={() => {
        if (hotspot.type === "scene") onSceneClick?.(hotspot);
        else onInfoClick?.(hotspot);
      }}
      className={clsx(
        "absolute -translate-x-1/2 -translate-y-1/2",
        "aura-hotspot",
        isScene ? "aura-hotspot--scene" : "aura-hotspot--info",
      )}
      style={{
        left: `${hotspot.x * 100}%`,
        top: `${hotspot.y * 100}%`,
      }}
    >
      {isScene ? "↓" : "i"}
    </button>
  );
}

/** Modulo that always returns a non-negative remainder. */
function wrap(n: number, mod: number): number {
  if (mod <= 0) return 0;
  return ((n % mod) + mod) % mod;
}

function isFrameInRange(
  frame: number,
  range: { start: number; end: number },
): boolean {
  const { start, end } = range;
  // Inclusive range, handles wrap-around (e.g. start=34, end=2 → 34,35,0,1,2).
  if (start <= end) return frame >= start && frame <= end;
  return frame >= start || frame <= end;
}
