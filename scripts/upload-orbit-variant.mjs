// One-shot uploader for an orbit variant. Reads ordered PNGs from a source
// directory, converts to WebP, renames to 00.webp..NN.webp, generates
// preview.webp, and pushes everything to Supabase Storage with immutable
// cache-control. Usage:
//   node scripts/upload-orbit-variant.mjs <srcDir> <modelId> <variantId>
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "aura-experience";
const CACHE_CONTROL = "31536000";

if (!SUPABASE_URL || !SECRET) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env.");
  process.exit(1);
}

const [, , srcDir, modelId, variantId] = process.argv;
if (!srcDir || !modelId || !variantId) {
  console.error("Usage: node scripts/upload-orbit-variant.mjs <srcDir> <modelId> <variantId>");
  process.exit(1);
}

async function uploadObject(remotePath, body, contentType) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${remotePath}?cacheControl=${CACHE_CONTROL}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET}`,
      apikey: SECRET,
      "Content-Type": contentType,
      "x-upsert": "true",
      "Cache-Control": `public, max-age=${CACHE_CONTROL}, immutable`,
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload ${remotePath} failed: ${res.status} ${text}`);
  }
}

const REMOTE_PREFIX = `${modelId}/exterior-orbit/${variantId}`;

// Pick every image file from srcDir, sort by name — the upstream renderer
// produces sequential frames (`mossgreen_0001.png` … `mossgreen_0036.png`)
// so alphabetical sort matches frame order exactly.
const IMG = /\.(png|jpe?g|webp)$/i;
const files = readdirSync(srcDir).filter((f) => IMG.test(f)).sort();
if (files.length === 0) {
  console.error(`No PNG/JPG/WEBP files found in ${srcDir}`);
  process.exit(1);
}

console.log(`Uploading ${files.length} frames → ${REMOTE_PREFIX}/`);

for (let i = 0; i < files.length; i++) {
  const srcPath = resolve(srcDir, files[i]);
  const dstName = `${String(i).padStart(2, "0")}.webp`;
  const buf = readFileSync(srcPath);
  const webp = await sharp(buf)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await uploadObject(`${REMOTE_PREFIX}/${dstName}`, webp, "image/webp");
  process.stdout.write(`  ${dstName}  ${(webp.length / 1024).toFixed(0)} KB\n`);
}

// Preview frame — same source as frame 0, scaled down for thumbnails.
const previewBuf = await sharp(readFileSync(resolve(srcDir, files[0])))
  .resize({ width: 480 })
  .webp({ quality: 70 })
  .toBuffer();
await uploadObject(`${REMOTE_PREFIX}/preview.webp`, previewBuf, "image/webp");
console.log(`  preview.webp  ${(previewBuf.length / 1024).toFixed(0)} KB`);

console.log(`\n✓ ${files.length} frames + preview pushed to ${REMOTE_PREFIX}/`);
