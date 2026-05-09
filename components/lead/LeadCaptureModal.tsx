"use client";

import { Dialog } from "@/components/ui/Dialog";

import { LeadForm } from "./LeadForm";

type LeadCaptureModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LeadCaptureModal({ open, onClose }: LeadCaptureModalProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Nezávazná poptávka">
      {/* Unmount on close so useActionState state resets between sessions. */}
      {open ? <LeadForm /> : null}
    </Dialog>
  );
}
