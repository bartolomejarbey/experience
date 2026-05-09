// Type declarations for vanilla Pannellum 2.5.6.
//
// No DefinitelyTyped package exists. The library's CommonJS entry attaches
// itself to `window.pannellum` as a side-effect of being loaded, so we
// declare the import as a side-effect module and augment the global Window.
//
// All interfaces below are intentionally global (this file has no top-level
// imports/exports) so they can be referenced anywhere without ceremony.

declare module "pannellum";
declare module "pannellum/build/pannellum.css";

interface PannellumHotSpot {
  pitch: number;
  yaw: number;
  type: "info" | "scene";
  text?: string;
  sceneId?: string;
  targetPitch?: number;
  targetYaw?: number;
  targetHfov?: number;
  cssClass?: string;
  createTooltipFunc?: (div: HTMLElement, args?: unknown) => void;
  createTooltipArgs?: unknown;
  clickHandlerFunc?: (e: MouseEvent, args?: unknown) => void;
  clickHandlerArgs?: unknown;
}

interface PannellumSceneConfig {
  type?: "equirectangular" | "cubemap" | "multires";
  panorama?: string;
  cubeMap?: string[];
  hfov?: number;
  pitch?: number;
  yaw?: number;
  minHfov?: number;
  maxHfov?: number;
  minPitch?: number;
  maxPitch?: number;
  minYaw?: number;
  maxYaw?: number;
  sceneFadeDuration?: number;
  hotSpots?: PannellumHotSpot[];
  hotSpotDebug?: boolean;
  preview?: string;
  basePath?: string;
}

interface PannellumDefaultConfig extends PannellumSceneConfig {
  firstScene?: string;
}

interface PannellumViewerConfig extends PannellumSceneConfig {
  autoLoad?: boolean;
  autoRotate?: number;
  autoRotateInactivityDelay?: number;
  autoRotateStopDelay?: number;
  showControls?: boolean;
  showFullscreenCtrl?: boolean;
  showZoomCtrl?: boolean;
  mouseZoom?: boolean;
  doubleClickZoom?: boolean;
  draggable?: boolean;
  keyboardZoom?: boolean;
  disableKeyboardCtrl?: boolean;
  crossOrigin?: "anonymous" | "use-credentials";
  orientationOnByDefault?: boolean;
  default?: PannellumDefaultConfig;
  scenes?: Record<string, PannellumSceneConfig>;
  backgroundColor?: [number, number, number];
}

interface PannellumViewer {
  loadScene(id: string, pitch?: number, yaw?: number, hfov?: number): void;
  getScene(): string;
  getYaw(): number;
  setYaw(yaw: number, animated?: boolean | number, callback?: () => void): void;
  getPitch(): number;
  setPitch(pitch: number, animated?: boolean | number, callback?: () => void): void;
  getHfov(): number;
  setHfov(hfov: number, animated?: boolean | number, callback?: () => void): void;
  startOrientation(): void;
  stopOrientation(): void;
  isOrientationSupported(): boolean;
  isOrientationActive(): boolean;
  destroy(): void;
  on(event: string, handler: (...args: unknown[]) => void): PannellumViewer;
  off(event: string, handler: (...args: unknown[]) => void): PannellumViewer;
  toggleFullscreen(): void;
  resize(): void;
}

interface PannellumGlobal {
  viewer(container: HTMLElement | string, config: PannellumViewerConfig): PannellumViewer;
}

interface Window {
  pannellum?: PannellumGlobal;
}
