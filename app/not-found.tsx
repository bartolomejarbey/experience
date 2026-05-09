import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-cream text-ink flex min-h-dvh flex-col items-center justify-center p-8 text-center">
      <h1 className="font-display text-5xl">Stránka nenalezena</h1>
      <p className="text-ink-muted font-body mt-3 max-w-md">
        Adresa, kterou jste zadali, neexistuje. Možná byla přesunuta nebo došlo
        k překlepu.
      </p>
      <Link
        href="/luma"
        className="rounded-control bg-terracotta text-cream font-body hover:bg-terracotta-soft mt-8 px-6 py-3 transition-colors"
      >
        Otevřít model Luma
      </Link>
    </main>
  );
}
