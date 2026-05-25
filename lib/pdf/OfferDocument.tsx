import "server-only";

import {
  Document,
  Font,
  Image as PdfImage,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { formatPrice } from "@/lib/format";

import { PDF_FONT_PATHS } from "./assets";
import type { PdfSummary } from "./build-summary";

// ── Fonts ──────────────────────────────────────────────────────
// Inter + Fraunces in their Latin-Extended cuts so every Czech
// diacritic (ě š č ř ž ů ý á í é ó ú) renders correctly. Without
// these the default Helvetica falls back to WinAnsi and breaks.
Font.register({
  family: "Inter",
  fonts: [
    { src: PDF_FONT_PATHS.interRegular, fontWeight: 400 },
    { src: PDF_FONT_PATHS.interBold, fontWeight: 700 },
  ],
});

Font.register({
  family: "Fraunces",
  fonts: [
    { src: PDF_FONT_PATHS.frauncesRegular, fontWeight: 400 },
    { src: PDF_FONT_PATHS.frauncesSemiBold, fontWeight: 600 },
  ],
});

const colors = {
  ink: "#1A1612",
  inkMuted: "#5A4E45",
  terracotta: "#B8845F",
  brown: "#4A3526",
  cream: "#F5F0E6",
  rule: "#E0D5C5",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontFamily: "Inter",
    fontSize: 10,
    color: colors.ink,
    backgroundColor: "#FFFFFF",
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  brandLogo: { width: 44, height: 36 },
  brandMeta: {
    fontFamily: "Inter",
    fontSize: 9,
    color: colors.inkMuted,
  },
  heroLabel: {
    fontFamily: "Inter",
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.inkMuted,
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 32,
    color: colors.ink,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 11,
    color: colors.inkMuted,
    marginBottom: 20,
  },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.inkMuted,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 6,
    color: colors.ink,
  },
  paragraph: {
    color: colors.ink,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  configRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.rule,
  },
  configLabel: { color: colors.inkMuted, width: "40%" },
  configValue: { color: colors.ink, flex: 1 },
  configPrice: { color: colors.inkMuted, width: 110, textAlign: "right" },
  summaryBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: colors.cream,
    borderRadius: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: { color: colors.inkMuted },
  summaryValue: { color: colors.ink },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
  },
  totalLabel: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 12,
    color: colors.ink,
  },
  totalValue: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 18,
    color: colors.terracotta,
  },
  section: { marginTop: 24 },
  // ── Photo grid (4 columns × 3 rows = 12 frames at 30°) ────────
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -3,
  },
  photoCell: {
    width: "25%",
    paddingHorizontal: 3,
    paddingBottom: 6,
  },
  photoBox: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.cream,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: colors.rule,
    alignItems: "center",
    justifyContent: "center",
  },
  photoBoxLabel: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 9,
    color: colors.ink,
  },
  photoBoxHint: {
    marginTop: 2,
    fontSize: 7,
    color: colors.inkMuted,
    opacity: 0.6,
  },
  specGrid: { flexDirection: "row", flexWrap: "wrap" },
  specRow: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingRight: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.rule,
  },
  specLabel: { color: colors.inkMuted },
  specValue: { color: colors.ink },
  bullet: { flexDirection: "row", marginBottom: 4 },
  bulletDot: { color: colors.terracotta, width: 10 },
  bulletText: { flex: 1, color: colors.ink },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: colors.inkMuted,
  },
});

type OrbitView = {
  /** Position in the orbit measured in degrees from front (0° = front). */
  degrees: number;
  /** Frame index in a 36-frame loop (every 10° step). */
  frameIndex: number;
};

const ORBIT_VIEWS: OrbitView[] = Array.from({ length: 12 }, (_, i) => ({
  degrees: i * 30,
  frameIndex: i * 3,
}));

type OfferDocumentProps = {
  summary: PdfSummary;
  /** Pre-rendered black AURA logo (PNG buffer). Passed in by the route so
   *  Sharp doesn't have to run inside the React tree. */
  logo: Buffer;
};

export function OfferDocument({ summary, logo }: OfferDocumentProps) {
  const { model, lines, basePrice, totalPrice, generatedOn } = summary;
  const info = model.info;
  const optionTotal = totalPrice - basePrice;

  return (
    <Document
      title={`AURA ${model.name} — cenová nabídka`}
      author="AURA Homes"
      subject="Cenová nabídka konfigurace"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          <PdfImage src={logo} style={styles.brandLogo} />
          <Text style={styles.brandMeta}>Cenová nabídka · {generatedOn}</Text>
        </View>

        <Text style={styles.heroLabel}>Model</Text>
        <Text style={styles.heroTitle}>{model.name}</Text>
        <Text style={styles.heroSubtitle}>
          {model.type} · {model.area} m² užitné plochy
        </Text>

        <View style={styles.rule} />

        {info?.description ? (
          <View style={{ marginBottom: 20 }}>
            {info.tagline ? <Text style={styles.tagline}>{info.tagline}</Text> : null}
            <Text style={styles.paragraph}>{info.description}</Text>
          </View>
        ) : null}

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>
            Vizualizace exteriéru · pohled každých 30°
          </Text>
          <View style={styles.photoGrid}>
            {ORBIT_VIEWS.map((view) => (
              <View key={view.degrees} style={styles.photoCell}>
                <View style={styles.photoBox}>
                  <Text style={styles.photoBoxLabel}>{view.degrees}°</Text>
                  <Text style={styles.photoBoxHint}>placeholder</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Vaše konfigurace</Text>
        <View>
          {lines.map((line) => (
            <View key={line.key} style={styles.configRow}>
              <Text style={styles.configLabel}>{line.label}</Text>
              <Text style={styles.configValue}>{line.value}</Text>
              <Text style={styles.configPrice}>
                {line.priceModifier === 0
                  ? "v ceně"
                  : line.priceModifier > 0
                    ? `+ ${formatPrice(line.priceModifier)}`
                    : `− ${formatPrice(Math.abs(line.priceModifier))}`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Základní cena</Text>
            <Text style={styles.summaryValue}>{formatPrice(basePrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Příplatky a slevy</Text>
            <Text style={styles.summaryValue}>
              {optionTotal === 0
                ? formatPrice(0)
                : optionTotal > 0
                  ? `+ ${formatPrice(optionTotal)}`
                  : `− ${formatPrice(Math.abs(optionTotal))}`}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Celkem</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        {info?.highlights && info.highlights.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hlavní přednosti</Text>
            {info.highlights.map((h) => (
              <View key={h} style={styles.bullet}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>{h}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {info?.specs && info.specs.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Technické parametry</Text>
            <View style={styles.specGrid}>
              {info.specs.map((spec) => (
                <View key={spec.label} style={styles.specRow}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {info?.materials && info.materials.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Standardní materiály</Text>
            <View style={styles.specGrid}>
              {info.materials.map((spec) => (
                <View key={spec.label} style={styles.specRow}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.footer} fixed>
          <Text>AURA Homes · aurahomes.cz</Text>
          <Text>Nabídka je orientační, platí 30 dní od data vygenerování.</Text>
        </View>
      </Page>
    </Document>
  );
}
