// Paystack configuration and utilities

// TODO: Move this to environment variables
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // Amount in kobo
  publicKey: string;
  currency?: string;
  channels?: string[];
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
    [key: string]: unknown;
  };
}

/**
 * Generate a unique payment reference
 */
export function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KRP-${timestamp}-${random}`;
}

/**
 * Get Paystack payment configuration
 */
export function getPaystackConfig(
  email: string,
  amount: number,
  metadata?: PaystackConfig["metadata"]
): PaystackConfig {
  return {
    reference: generateReference(),
    email,
    amount: amount * 100, // Convert Naira to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
    channels: ["card", "bank", "ussd", "bank_transfer"],
    metadata,
  };
}
