"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { useConfig } from "@/lib/config/useConfig";
import { configStateToQuery } from "@/lib/pdf/build-summary";

export function PdfDownloadButton() {
  const { model, state } = useConfig();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const href = useMemo(() => {
    const qs = configStateToQuery(state);
    return `/api/pdf/${model.id}?${qs}`;
  }, [model.id, state]);

  const handleClick = async () => {
    setError(null);
    setDownloading(true);
    try {
      const res = await fetch(href, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AURA-${model.name}-nabidka.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke after the click handler has a chance to dispatch the download.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("[PdfDownloadButton] failed:", err);
      setError("Stažení PDF se nepodařilo. Zkuste to prosím znovu.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="ghost"
        size="md"
        onClick={handleClick}
        isLoading={downloading}
        className="w-full"
      >
        {downloading ? "Generuji PDF…" : "Stáhnout PDF nabídku"}
      </Button>
      {error ? (
        <p
          role="alert"
          className="text-terracotta font-body text-center text-xs"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
