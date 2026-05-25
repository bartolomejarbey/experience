import "server-only";

import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const projectRoot = process.cwd();
const fontsDir = path.join(projectRoot, "public", "fonts");
const logoPath = path.join(projectRoot, "public", "aura-logo.png");

export const PDF_FONT_PATHS = {
  interRegular: path.join(fontsDir, "Inter-Regular.woff"),
  interBold: path.join(fontsDir, "Inter-Bold.woff"),
  frauncesRegular: path.join(fontsDir, "Fraunces-Regular.woff"),
  frauncesSemiBold: path.join(fontsDir, "Fraunces-SemiBold.woff"),
} as const;

let blackLogoPromise: Promise<Buffer> | null = null;

/** Returns a cached PNG buffer of the AURA logo recoloured to pure black,
 *  preserving the source alpha channel. Computed once per process. */
export function getBlackLogoBuffer(): Promise<Buffer> {
  if (!blackLogoPromise) {
    const source = fs.readFileSync(logoPath);
    blackLogoPromise = sharp(source)
      // Collapse every RGB channel to 0 while keeping alpha intact —
      // the logo becomes a black silhouette on transparent background.
      .recomb([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ])
      .png()
      .toBuffer();
  }
  return blackLogoPromise;
}
