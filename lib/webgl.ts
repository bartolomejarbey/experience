"use client";

let cached: boolean | null = null;

/**
 * Detect WebGL availability (cached after first call). Returns false on the
 * server. Used by the viewer route to fall back to a 2D gallery when WebGL
 * is unavailable.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== null) return cached;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    cached = Boolean(gl);
    return cached;
  } catch {
    cached = false;
    return false;
  }
}
