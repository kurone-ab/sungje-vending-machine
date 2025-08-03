import type { Drink } from "./drink";

export interface PaymentResult {
  success: boolean;
  message: string;
  changeAmount?: number;
}

export interface PaymentStrategy {
  canPurchase(drink: Drink, insertedMoney?: number): boolean;
  processPayment(drink: Drink, insertedMoney?: number): Promise<PaymentResult>;
}

// Common utility types
export type PaymentMethod = "cash" | "card";
