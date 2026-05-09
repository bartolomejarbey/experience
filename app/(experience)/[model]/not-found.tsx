import Link from "next/link";

export default function ModelNotFound() {
  return (
    <div className="bg-cream text-ink flex h-full flex-col items-center justify-center p-8 text-center">
      <h1 className="font-display text-4xl">Model nenalezen</h1>
      <p className="text-ink-muted font-body mt-3 max-w-md">
        Tato adresa neodpovídá žádnému z modelů AURA. Vyberte prosím jeden ze
        čtyř dostupných modelů.
      </p>
      <Link
        href="/luma"
        className="rounded-control bg-terracotta text-cream font-body hover:bg-terracotta-soft mt-8 px-6 py-3 transition-colors"
      >
        Otevřít model Luma
      </Link>
    </div>
  );
}
