"use client";

import { Dialog } from "@/components/ui/Dialog";
import type { InfoHotSpot } from "@/lib/types/scene";

type InfoHotspotDialogProps = {
  hotspot: InfoHotSpot | null;
  onClose: () => void;
};

export function InfoHotspotDialog({ hotspot, onClose }: InfoHotspotDialogProps) {
  return (
    <Dialog
      open={hotspot !== null}
      onClose={onClose}
      title={hotspot?.titleCs ?? ""}
    >
      {hotspot && (
        <div className="flex flex-col gap-4">
          {hotspot.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hotspot.imageUrl}
              alt=""
              className="rounded-control w-full"
            />
          )}
          <p className="text-ink font-body leading-relaxed">{hotspot.bodyCs}</p>
        </div>
      )}
    </Dialog>
  );
}
