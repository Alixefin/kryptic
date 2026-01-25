// Paystack configuration and utilities

// TODO: Move this to environment variables
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

export interface PaystackMetadata {
  custom_fields: PaystackCustomField[];
  [key: string]: unknown;
}

export interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // Amount in kobo
  publicKey: string;
  currency?: string;
  channels?: string[];
  metadata?: PaystackMetadata;
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
  customFields?: PaystackCustomField[]
): PaystackConfig {
  const config: PaystackConfig = {
    reference: generateReference(),
    email,
    amount: amount * 100, // Convert Naira to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
    channels: ["card", "bank", "ussd", "bank_transfer"],
  };

  if (customFields && customFields.length > 0) {
    config.metadata = {
      custom_fields: customFields,
    };
  }

  return config;
}
