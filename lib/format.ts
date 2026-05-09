const PRICE_FORMATTER = new Intl.NumberFormat("cs-CZ", {
  maximumFractionDigits: 0,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("cs-CZ", { dateStyle: "long" });

const DATETIME_FORMATTER = new Intl.DateTimeFormat("cs-CZ", {
  dateStyle: "long",
  timeStyle: "short",
});

export function formatPrice(value: number): string {
  return `${PRICE_FORMATTER.format(value)} Kč`;
}

export function formatDate(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return DATE_FORMATTER.format(date);
}

export function formatDateTime(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return DATETIME_FORMATTER.format(date);
}
