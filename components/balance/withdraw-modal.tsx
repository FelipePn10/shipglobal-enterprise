"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { CurrencyCode, BalanceData } from "@/types/balance";
import type { LucideIcon } from "lucide-react";

interface CurrencyDetails {
  symbol: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (currency: CurrencyCode, amount: number) => void;
  currencies: Record<CurrencyCode, CurrencyDetails>;
  balances: BalanceData;
}

export function WithdrawalModal({ isOpen, onClose, onWithdraw, currencies, balances }: WithdrawalModalProps) {
  const { data: session, status } = useSession();
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = useCallback(async () => {
    if (status !== "authenticated" || !session?.user) {
      toast({ title: "Authentication Error", description: "Please log in to withdraw.", variant: "destructive" });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }

    if (!balances[currency] || parsedAmount > balances[currency].amount) {
      toast({ title: "Insufficient Balance", description: `Not enough ${currency}.`, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/create-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parsedAmount,
          currency,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create payout");
      }

      onWithdraw(currency, parsedAmount);
      toast({
        title: "Withdrawal Initiated",
        description: `${parsedAmount} ${currency} requested (Payout ID: ${result.payoutId}).`,
      });
      setAmount("");
      onClose();
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: (error as Error).message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [amount, currency, balances, onWithdraw, onClose, session, status]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border border-zinc-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>Choose the currency and amount to withdraw.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                {Object.entries(currencies).map(([code, { name, symbol }]) => (
                  <SelectItem key={code} value={code}>
                    {code} - {name} ({symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="bg-zinc-800 border-zinc-700 text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500"
            onClick={handleWithdraw}
            disabled={loading || !amount || parseFloat(amount) <= 0 || status !== "authenticated"}
          >
            {loading ? "Processing..." : "Withdraw"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}