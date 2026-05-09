"use client";

import clsx from "clsx";
import { useEffect, useRef, type ReactNode } from "react";

import { Button } from "./Button";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerElRef = useRef<HTMLElement | null>(null);

  // Sync open state with the native <dialog> element. <dialog>.showModal()
  // gives us focus trap + ESC close + ARIA modal semantics for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      triggerElRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Restore focus to whatever element opened the dialog.
  useEffect(() => {
    if (!open && triggerElRef.current) {
      triggerElRef.current.focus();
      triggerElRef.current = null;
    }
  }, [open]);

  // Click on the backdrop (the <dialog> element itself, outside the inner
  // panel) closes the dialog.
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={clsx(
        "rounded-card bg-cream text-ink m-auto w-full max-w-lg p-0",
        "backdrop:bg-ink/70 backdrop:backdrop-blur-sm",
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "open:animate-fade-in",
        className,
      )}
      aria-labelledby="aura-dialog-title"
    >
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <h2
          id="aura-dialog-title"
          className="font-display text-ink mt-1 text-2xl leading-tight"
        >
          {title}
        </h2>
        <Button variant="icon" size="md" onClick={onClose} aria-label="Zavřít">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>
      <div className="p-6 pt-4">{children}</div>
    </dialog>
  );
}
