export const fmtIls = (value: unknown) => new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 2 }).format(Number(value));
export const fmtCurrency = (value: unknown, currency: string) => new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value));
export const toNumber = (value: unknown) => Number(value || 0);
