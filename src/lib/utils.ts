import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as BDT currency (৳)
 */
export function formatCurrency(amount: number): string {
  return `৳${amount.toFixed(2)}`;
}

/**
 * Format a number as BDT currency with locale formatting
 */
export function formatCurrencyLocale(amount: number): string {
  return `৳${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}
