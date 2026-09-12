export type FxQuote = { rate: number; source: string; capturedAt: Date };
export async function quoteToIls(currency: string): Promise<FxQuote> {
  if (currency.toUpperCase() === "ILS") return { rate: 1, source: "ILS parity", capturedAt: new Date() };
  const root = process.env.FX_API_URL || "https://api.frankfurter.app/latest";
  const url = `${root}?from=${encodeURIComponent(currency.toUpperCase())}&to=ILS`;
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("The exchange-rate service is unavailable. Try again shortly.");
  const data = await response.json() as { rates?: { ILS?: number } };
  const rate = data.rates?.ILS;
  if (!rate || !Number.isFinite(rate)) throw new Error("No ILS conversion rate was returned for this currency.");
  return { rate, source: new URL(root).hostname, capturedAt: new Date() };
}
