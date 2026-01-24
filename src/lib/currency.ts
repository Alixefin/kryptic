// Currency formatting utilities for Nigerian Naira

export const CURRENCY = {
  code: "NGN",
  symbol: "₦",
  name: "Nigerian Naira",
};

/**
 * Format a number as Nigerian Naira
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price without currency symbol
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Convert kobo to Naira (Paystack uses kobo)
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/**
 * Convert Naira to kobo (Paystack uses kobo)
 */
export function nairaToKobo(naira: number): number {
  return naira * 100;
}
