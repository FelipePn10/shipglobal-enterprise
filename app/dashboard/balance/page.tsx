"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { BalanceClient } from "@/components/balance/balance-client";
import { DollarSign, Euro, Currency } from "lucide-react";
import { useState, useEffect } from "react";
import { BalanceData, Transaction } from "@/types/balance";

async function fetchBalanceData(userId: number) {
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

export default function BalancePage() {
  const [balances, setBalances] = useState<BalanceData>({
    USD: { amount: 0, lastUpdated: new Date().toISOString() },
    EUR: { amount: 0, lastUpdated: new Date().toISOString() },
    CNY: { amount: 0, lastUpdated: new Date().toISOString() },
    JPY: { amount: 0, lastUpdated: new Date().toISOString() },
  });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    USD: 1,
    EUR: 0.92,
    CNY: 7.25,
    JPY: 150.45,
    BRL: 6.2,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; USD: number; EUR: number; CNY: number; JPY: number }>>([
    {
      date: new Date().toISOString().split("T")[0],
      USD: 0,
      EUR: 0,
      CNY: 0,
      JPY: 0,
    },
  ]);

  useEffect(() => {
    const testUserId = 1;

    fetchBalanceData(testUserId)
      .then((data) => {
        setBalances(data.balances);
        setExchangeRates(data.exchangeRates);
        setTransactions(data.transactions);
        setHistoricalData(data.historicalData);
      })
      .catch((error) => {
        console.error("Balance Page Error:", error);
      });
  }, []);

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