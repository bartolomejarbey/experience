import type { ModelId } from "@/lib/types/model";
import type { PanoramaVariant } from "@/lib/types/scene";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const BUCKET = "aura-experience";

const VARIANT_FILENAME: Record<PanoramaVariant, string> = {
  "full-8k": "full-8k.webp",
  "medium-4k": "medium-4k.webp",
  preview: "preview.webp",
  "full-8k-jpg": "full-8k.jpg",
};

export function buildPanoramaUrl(
  modelId: ModelId,
  sceneFolder: string,
  variant: PanoramaVariant = "medium-4k",
): string {
  const filename = VARIANT_FILENAME[variant];
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${modelId}/${sceneFolder}/${filename}`;
}
