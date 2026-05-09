import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MODEL_REGISTRY, getModelById } from "@/lib/scenes";
import { MODEL_IDS, isModelId } from "@/lib/types/model";

import { ComingSoon } from "./_components/ComingSoon";
import { ModelExperience } from "./_components/ModelExperience";

type Props = {
  params: Promise<{ model: string }>;
};

export function generateStaticParams() {
  return MODEL_IDS.map((model) => ({ model }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model: modelParam } = await params;
  if (!isModelId(modelParam)) {
    return { title: "Model nenalezen" };
  }
  const model = MODEL_REGISTRY[modelParam];
  return {
    title: model.name,
    description: `Interaktivní 360° prohlídka modelu ${model.name} (${model.type}, ${model.area} m²). Konfigurujte fasádu, terasu a pergolu, sledujte cenu naživo.`,
  };
}

export default async function ModelPage({ params }: Props) {
  const { model: modelParam } = await params;
  if (!isModelId(modelParam)) notFound();

  const model = getModelById(modelParam);

  if (model.status === "coming-soon") {
    return <ComingSoon model={model} />;
  }

  return <ModelExperience model={model} />;
}
