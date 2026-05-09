import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AURA Homes Experience",
    template: "%s — AURA Homes Experience",
  },
  description:
    "Interaktivní 360° prohlídka a konfigurátor dřevostaveb AURA Homes. Procházejte modely, vybírejte fasádu, terasu a pergolu, sledujte cenu naživo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${fraunces.variable} ${interTight.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="bg-cream text-ink font-body min-h-dvh antialiased">
        {children}
      </body>
    </html>
  );
}
