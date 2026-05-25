import type { ConfigurationKey } from "./model";

export type HotSpotBase = {
  id: string;
};

export type SceneHotSpot = HotSpotBase & {
  type: "scene";
  targetSceneId: string;
  targetYaw?: number;
  labelCs: string;
};

export type InfoHotSpot = HotSpotBase & {
  type: "info";
  titleCs: string;
  bodyCs: string;
  imageUrl?: string;
};

/** Pannellum hotspot — placed in spherical coordinates inside one panorama. */
export type PanoramaHotSpot = (SceneHotSpot | InfoHotSpot) & {
  pitch: number;
  yaw: number;
};

/** Orbit hotspot — 2D overlay above the frame sequence, visible across a
 *  contiguous frame range. Position is fractional (0..1) of viewer box. */
export type OrbitHotSpot = (SceneHotSpot | InfoHotSpot) & {
  framesVisible: { start: number; end: number };
  x: number;
  y: number;
};

export type PanoramaScene = {
  type: "panorama";
  id: string;
  title: string;
  panorama: string;
  preview: string;
  hfov: number;
  pitch: number;
  yaw: number;
  hotSpots: PanoramaHotSpot[];
};

export type OrbitScene = {
  type: "orbit";
  id: string;
  title: string;
  preview: string;
  /** How many frames make up the full loop (typically 36 = every 10°). */
  frameCount: number;
  /** Frame index shown on first render (e.g. 0 = front view). */
  startFrame: number;
  /** Config keys whose values switch the active frame set. Order matters —
   *  it determines the folder-name suffix (e.g. `["facade","pergola"]`
   *  → `dark-no`). */
  variantKeys: ConfigurationKey[];
  /** Storage sub-folder for this scene inside the model's bucket prefix,
   *  e.g. `"exterior-orbit"`. The full path becomes
   *  `<model>/<sceneFolder>/<variantKey>/<NN>.webp`. */
  sceneFolder: string;
  hotSpots: OrbitHotSpot[];
};

export type Scene = PanoramaScene | OrbitScene;

export type PanoramaVariant = "full-8k" | "medium-4k" | "preview" | "full-8k-jpg";
