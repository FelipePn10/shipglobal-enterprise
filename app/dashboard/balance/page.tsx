import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { BalanceClient } from "@/components/balance/balance-client";
import { DollarSign, Euro, Currency } from "lucide-react";
import { BalanceData, Transaction } from "@/types/balance";

async function fetchBalanceData(userId: number): Promise<{
  balances: BalanceData;
  exchangeRates: Record<string, number>;
  transactions: Transaction[];
  historicalData: Array<{ date: string; USD: number; EUR: number; CNY: number; JPY: number }>;
}> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/balance?userId=${userId}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch balance data");
  }

  const data = await res.json();
  return {
    balances: data.balances,
    exchangeRates: data.exchangeRates,
    transactions: data.transactions,
    historicalData: data.historicalData,
  };
}

export default async function BalancePage() {
  // For testing, use a fixed userId (e.g., 1) since auth is removed
  const testUserId = 1;

  let balances: BalanceData = {};
  let exchangeRates: Record<string, number> = {};
  let transactions: Transaction[] = [];
  let historicalData: Array<{ date: string; USD: number; EUR: number; CNY: number; JPY: number }> = [];

  try {
    const data = await fetchBalanceData(testUserId);
    balances = data.balances;
    exchangeRates = data.exchangeRates;
    transactions = data.transactions;
    historicalData = data.historicalData;
  } catch (error) {
    console.error("Balance Page Error:", error);
    // Fallback data
    balances = {
      USD: { amount: 0, lastUpdated: new Date().toISOString() },
      EUR: { amount: 0, lastUpdated: new Date().toISOString() },
      CNY: { amount: 0, lastUpdated: new Date().toISOString() },
      JPY: { amount: 0, lastUpdated: new Date().toISOString() },
    };
    exchangeRates = {
      USD: 1,
      EUR: 0.92,
      CNY: 7.25,
      JPY: 150.45,
      BRL: 6.2,
    };
    transactions = [];
    historicalData = [
      {
        date: new Date().toISOString().split("T")[0],
        USD: 0,
        EUR: 0,
        CNY: 0,
        JPY: 0,
      },
    ];
  }

  const currencies = {
    USD: { symbol: "$", name: "US Dollar", icon: DollarSign, color: "from-blue-500 to-indigo-500" },
    EUR: { symbol: "€", name: "Euro", icon: Euro, color: "from-indigo-500 to-violet-500" },
    CNY: { symbol: "¥", name: "Chinese Yuan", icon: Currency, color: "from-red-500 to-orange-500" },
    JPY: { symbol: "¥", name: "Japanese Yen", icon: Currency, color: "from-emerald-500 to-teal-500" },
  };

  return (
    <DashboardLayout>
      <BalanceClient
        initialBalances={balances}
        initialExchangeRates={exchangeRates}
        initialTransactions={transactions}
        initialHistoricalData={historicalData}
        currencies={currencies}
      />
    </DashboardLayout>
  );
}