export type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY";
export type PaymentCurrency = CurrencyCode | "BRL";

export interface BalanceData {
  [key: string]: {
    amount: number;
    lastUpdated: string;
  };
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer" | "refund";
  amount: number;
  currency: CurrencyCode;
  date: string;
  status: "completed" | "pending" | "failed";
  description?: string;
  paymentIntentId?: string;
  targetCurrency?: CurrencyCode;
  createdAt?: Date;
  updatedAt?: Date;
  metadata?: Record<string, any>;
}