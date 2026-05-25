import "server-only";

import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { MODEL_REGISTRY } from "@/lib/scenes";
import { getBlackLogoBuffer } from "@/lib/pdf/assets";
import { buildPdfSummary, resolveConfigFromQuery } from "@/lib/pdf/build-summary";
import { OfferDocument } from "@/lib/pdf/OfferDocument";
import { isModelId } from "@/lib/types/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { modelId: string };

export async function GET(
  request: Request,
  context: { params: Promise<Params> },
): Promise<Response> {
  const { modelId } = await context.params;

  if (!isModelId(modelId)) {
    return NextResponse.json({ error: "Unknown model" }, { status: 404 });
  }

  const model = MODEL_REGISTRY[modelId];
  if (model.status !== "available") {
    return NextResponse.json({ error: "Model not available" }, { status: 404 });
  }

  const url = new URL(request.url);
  const state = resolveConfigFromQuery(model, url.searchParams);
  const summary = buildPdfSummary(model, state);
  const logo = await getBlackLogoBuffer();

  const buffer = await renderToBuffer(<OfferDocument summary={summary} logo={logo} />);
  // `renderToBuffer` returns a Node Buffer; expose it as a Uint8Array so the
  // web Response constructor (used by NextResponse) accepts it.
  const body = new Uint8Array(buffer);

  const filename = `AURA-${model.name}-nabidka.pdf`;
  // RFC 5987-encoded filename* for Czech diacritics support.
  const encoded = encodeURIComponent(filename);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encoded}`,
      "Cache-Control": "no-store",
    },
  });
}
