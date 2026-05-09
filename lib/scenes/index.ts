import type { Model, ModelId } from "@/lib/types/model";
import { luma } from "./luma";
import { mare } from "./mare";
import { silva } from "./silva";
import { terra } from "./terra";

export const MODEL_REGISTRY: Record<ModelId, Model> = {
  luma,
  terra,
  silva,
  mare,
};

export function getModelById(id: ModelId): Model {
  return MODEL_REGISTRY[id];
}

export function getAllModels(): Model[] {
  return [luma, terra, silva, mare];
}

function validateModelScenes(model: Model): void {
  if (model.status !== "available") return;
  const sceneIds = new Set(Object.keys(model.scenes));
  if (!sceneIds.has(model.defaultSceneId)) {
    throw new Error(
      `Model "${model.id}": defaultSceneId "${model.defaultSceneId}" not found in scenes.`,
    );
  }
  for (const scene of Object.values(model.scenes)) {
    for (const hs of scene.hotSpots) {
      if (hs.type === "scene" && !sceneIds.has(hs.targetSceneId)) {
        throw new Error(
          `Model "${model.id}", scene "${scene.id}": hotspot "${hs.id}" ` +
            `targets unknown scene "${hs.targetSceneId}".`,
        );
      }
    }
  }
}

if (process.env.NODE_ENV !== "production") {
  for (const model of Object.values(MODEL_REGISTRY)) {
    validateModelScenes(model);
  }
}
