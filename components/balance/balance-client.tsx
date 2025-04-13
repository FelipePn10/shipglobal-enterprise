"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { DepositModal } from "@/components/balance/deposit-modal";
import { WithdrawalModal } from "@/components/balance/withdrawal-modal";
import { CurrencyCard } from "@/components/balance/currency-card";
import { TransactionHistory } from "@/components/balance/transaction-history";
import { BalanceChart } from "@/components/balance/balance-chart";
import { BalanceSummary } from "@/components/balance/balance-summary";
import { ExchangeRateTable } from "@/components/balance/exchange-rate-table";
import { Plus, RefreshCw } from "lucide-react";
import { CurrencyCode, PaymentCurrency, BalanceData, Transaction } from "@/types/balance";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface BalanceClientProps {
  initialBalances: BalanceData;
  initialExchangeRates: Record<string, number>;
  initialTransactions: Transaction[];
  initialHistoricalData: Array<{ date: string; USD: number; EUR: number; CNY: number; JPY: number }>;
  currencies: Record<
    CurrencyCode,
    { symbol: string; name: string; icon: any; color: string }
  >;
}

export function BalanceClient({
  initialBalances,
  initialExchangeRates,
  initialTransactions,
  initialHistoricalData,
  currencies,
}: BalanceClientProps) {
  const [balances, setBalances] = useState<BalanceData>(initialBalances);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    initialExchangeRates
  );
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [historicalData, setHistoricalData] = useState<
    Array<{ date: string; USD: number; EUR: number; CNY: number; JPY: number }>
  >(initialHistoricalData);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [depositCurrency, setDepositCurrency] = useState<CurrencyCode>("USD");
  const [loadingRates, setLoadingRates] = useState(false);

  const fetchBalanceData = async () => {
    setLoadingRates(true);
    try {
      const res = await fetch("/api/balance", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch balance data");
      const { balances: newBalances, exchangeRates: newRates, transactions: newTxs, historicalData: newHistory } = await res.json();
      setBalances(newBalances);
      setExchangeRates(newRates);
      setTransactions(newTxs);
      setHistoricalData(newHistory);
      toast({ title: "Exchange rates updated", description: "Latest market rates fetched." });
    } catch (error) {
      toast({
        title: "Failed to fetch rates",
        description: "Using last known rates.",
        variant: "destructive",
      });
    } finally {
      setLoadingRates(false);
    }
  };

  const handleDeposit = async (
    targetCurrency: CurrencyCode,
    amount: number,
    paymentCurrency: PaymentCurrency,
    clientSecret: string
  ) => {
    try {
      // Update database via API
      const response = await fetch("/api/balance/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: targetCurrency,
          amount,
          paymentCurrency,
          paymentIntentId: clientSecret,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to record deposit");
      }

      const { balance, transaction } = await response.json();

      // Update local state
      setBalances((prev) => ({
        ...prev,
        [targetCurrency]: {
          amount: balance.amount,
          lastUpdated: balance.lastUpdated,
        },
      }));

      setTransactions((prev) => [transaction, ...prev]);

      // Update historical data
      const today = new Date().toISOString().split("T")[0];
      setHistoricalData((prev) => {
        const lastDay = prev[prev.length - 1];
        if (lastDay.date === today) {
          return [
            ...prev.slice(0, -1),
            { ...lastDay, [targetCurrency]: balance.amount },
          ];
        }
        return [
          ...prev,
          {
            date: today,
            USD: balances.USD.amount,
            EUR: balances.EUR.amount,
            CNY: balances.CNY.amount,
            JPY: balances.JPY.amount,
            [targetCurrency]: balance.amount,
          },
        ];
      });

      toast({
        title: "Deposit successful",
        description: `${currencies[targetCurrency].symbol}${amount.toFixed(2)} added to ${targetCurrency} balance`,
      });
      setDepositModalOpen(false);
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: (error as Error).message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawal = async (targetCurrency: CurrencyCode, amount: number) => {
    if (amount > balances[targetCurrency].amount) {
      toast({ title: "Insufficient Balance", description: `Not enough ${targetCurrency}.`, variant: "destructive" });
      return;
    }

    try {
      const response = await fetch("/api/create-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: targetCurrency,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create payout");
      }

      // Update database via API
      const updateResponse = await fetch("/api/balance/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: targetCurrency,
          amount,
          payoutId: result.payoutId,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to record withdrawal");
      }

      const { balance, transaction } = await updateResponse.json();

      setBalances((prev) => ({
        ...prev,
        [targetCurrency]: {
          amount: balance.amount,
          lastUpdated: balance.lastUpdated,
        },
      }));

      setTransactions((prev) => [transaction, ...prev]);

      // Update historical data
      const today = new Date().toISOString().split("T")[0];
      setHistoricalData((prev) => {
        const lastDay = prev[prev.length - 1];
        if (lastDay.date === today) {
          return [
            ...prev.slice(0, -1),
            { ...lastDay, [targetCurrency]: balance.amount },
          ];
        }
        return [
          ...prev,
          {
            date: today,
            USD: balances.USD.amount,
            EUR: balances.EUR.amount,
            CNY: balances.CNY.amount,
            JPY: balances.JPY.amount,
            [targetCurrency]: balance.amount,
          },
        ];
      });

      toast({
        title: "Withdrawal Initiated",
        description: `${amount} ${targetCurrency} requested (Payout ID: ${result.payoutId}).`,
      });
      setWithdrawalModalOpen(false);
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: (error as Error).message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefund = async (transactionId: string, amount: number, currency: CurrencyCode, paymentIntentId?: string) => {
    if (!paymentIntentId) {
      toast({ title: "Refund Failed", description: "Missing payment details.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch("/api/create-refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, amount }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create refund");
      }

      // Update database via API
      const updateResponse = await fetch("/api/balance/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          amount,
          paymentIntentId,
          refundId: result.refundId,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to record refund");
      }

      const { balance, transaction } = await updateResponse.json();

      setBalances((prev) => ({
        ...prev,
        [currency]: {
          amount: balance.amount,
          lastUpdated: balance.lastUpdated,
        },
      }));

      setTransactions((prev) => [transaction, ...prev]);

      // Update historical data
      const today = new Date().toISOString().split("T")[0];
      setHistoricalData((prev) => {
        const lastDay = prev[prev.length - 1];
        if (lastDay.date === today) {
          return [
            ...prev.slice(0, -1),
            { ...lastDay, [currency]: balance.amount },
          ];
        }
        return [
          ...prev,
          {
            date: today,
            USD: balances.USD.amount,
            EUR: balances.EUR.amount,
            CNY: balances.CNY.amount,
            JPY: balances.JPY.amount,
            [currency]: balance.amount,
          },
        ];
      });

      toast({
        title: "Refund Processed",
        description: `${amount} ${currency} refunded (Refund ID: ${result.refundId}).`,
      });
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: (error as Error).message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalBalanceUSD = useMemo(() => {
    return Object.entries(balances).reduce((total, [currency, data]) => {
      return total + (data.amount / (exchangeRates[currency as CurrencyCode] || 1));
    }, 0);
  }, [balances, exchangeRates]);

  const openDepositModal = (currency: CurrencyCode) => {
    setDepositCurrency(currency);
    setDepositModalOpen(true);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Balance</h1>
          <p className="text-white/60">Manage your multi-currency balances</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchBalanceData} disabled={loadingRates}>
            {loadingRates ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Rates
              </>
            )}
          </Button>
          <Button
            className="bg-gradient-to-r from-indigo-500 to-rose-500"
            onClick={() => setDepositModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Deposit
          </Button>
          <Button variant="outline" onClick={() => setWithdrawalModalOpen(true)}>
            Withdraw
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <BalanceSummary
            totalBalanceUSD={totalBalanceUSD}
            currencies={Object.keys(balances).length}
            transactions={transactions.length}
          />
          <BalanceChart data={historicalData} currencies={currencies} />
        </TabsContent>

        <TabsContent value="balances" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(balances).map(([currency, data]) => (
              <CurrencyCard
                key={currency}
                currency={currency as CurrencyCode}
                amount={data.amount}
                symbol={currencies[currency as CurrencyCode].symbol}
                name={currencies[currency as CurrencyCode].name}
                icon={currencies[currency as CurrencyCode].icon}
                lastUpdated={new Date(data.lastUpdated).toLocaleString()}
                usdEquivalent={(data.amount / (exchangeRates[currency as CurrencyCode] || 1)).toFixed(2)}
                isExpanded={false}
                onToggleExpand={() => {}}
                onDeposit={() => openDepositModal(currency as CurrencyCode)}
                onTransfer={() => {}}
                exchangeRate={exchangeRates[currency as CurrencyCode] || 1}
                color={currencies[currency as CurrencyCode].color}
                recentTransactions={transactions.filter((t) => t.currency === (currency as CurrencyCode))}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <TransactionHistory
            transactions={transactions}
            currencies={currencies}
            onRefund={handleRefund}
          />
        </TabsContent>

        <TabsContent value="rates" className="mt-6">
          <ExchangeRateTable
            exchangeRates={exchangeRates}
            currencies={currencies}
            onRefresh={fetchBalanceData}
            isLoading={loadingRates}
          />
        </TabsContent>
      </Tabs>

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDeposit={handleDeposit}
        currencies={currencies}
        initialCurrency={depositCurrency}
        balances={balances}
        exchangeRates={exchangeRates}
      />

      <WithdrawalModal
        isOpen={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
        onWithdraw={handleWithdrawal}
        currencies={currencies}
        balances={balances}
      />
    </div>
  );
}