export type HotSpotBase = {
  id: string;
  pitch: number;
  yaw: number;
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

export type HotSpot = SceneHotSpot | InfoHotSpot;

export type FacadeVariant = "dark" | "light";

export type Scene = {
  id: string;
  title: string;
  panorama: string;
  preview: string;
  hfov: number;
  pitch: number;
  yaw: number;
  hotSpots: HotSpot[];
  exteriorView?: string;
  facadeVariant?: FacadeVariant;
};

export type PanoramaVariant = "full-8k" | "medium-4k" | "preview" | "full-8k-jpg";
