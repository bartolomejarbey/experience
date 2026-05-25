"use client";

import { Dialog } from "@/components/ui/Dialog";
import type { Model } from "@/lib/types/model";

type ModelInfoDialogProps = {
  open: boolean;
  onClose: () => void;
  model: Model;
};

export function ModelInfoDialog({ open, onClose, model }: ModelInfoDialogProps) {
  const info = model.info;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`${model.name} — ${model.type}`}
      className="max-w-2xl"
    >
      {info ? (
        <div className="flex flex-col gap-6">
          {info.tagline && (
            <p className="font-display text-ink text-xl leading-snug">
              {info.tagline}
            </p>
          )}
          <p className="text-ink font-body leading-relaxed">{info.description}</p>

          {info.highlights.length > 0 && (
            <section>
              <h3 className="text-ink-muted font-body mb-2 text-xs tracking-wide uppercase">
                Hlavní přednosti
              </h3>
              <ul className="text-ink font-body flex flex-col gap-1.5">
                {info.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="text-terracotta" aria-hidden="true">
                      ·
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <SpecGrid title="Technické parametry" items={info.specs} />
          <SpecGrid title="Standardní materiály" items={info.materials} />
        </div>
      ) : (
        <p className="text-ink-muted font-body">
          Detailní informace o modelu budou doplněny.
        </p>
      )}
    </Dialog>
  );
}

function SpecGrid({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="text-ink-muted font-body mb-2 text-xs tracking-wide uppercase">
        {title}
      </h3>
      <dl className="border-brown/10 grid grid-cols-1 gap-x-6 gap-y-2 border-t pt-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex justify-between gap-3 border-b border-brown/10 py-1.5"
          >
            <dt className="text-ink-muted font-body text-sm">{item.label}</dt>
            <dd className="text-ink font-body text-right text-sm">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
