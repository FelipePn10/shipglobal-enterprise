"use client";

import { useState, useEffect, useCallback, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, ArrowRight, Check, Shield, Sparkles } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import type { LucideIcon } from "lucide-react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CurrencyCode, PaymentCurrency } from "@/types/balance";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// Types
type PaymentMethod = "card";
type PaymentStep = "amount" | "payment" | "confirm";

interface CurrencyDetails {
  symbol: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (
    currency: CurrencyCode,
    amount: number,
    paymentCurrency: PaymentCurrency,
    clientSecret: string
  ) => void;
  currencies: Record<CurrencyCode, CurrencyDetails>;
  initialCurrency: CurrencyCode;
  exchangeRates: Record<string, number>;
}

// Floating Card Component
const FloatingCard = ({
  amount,
  currency,
  symbol,
  paymentMethod,
}: {
  amount: number;
  currency: CurrencyCode;
  symbol: string;
  paymentMethod: PaymentMethod;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getPaymentIcon = useCallback(() => {
    const icons: Record<PaymentMethod, JSX.Element> = {
      card: <CreditCard className="h-8 w-8 opacity-80" />,
    };
    return icons[paymentMethod];
  }, [paymentMethod]);

  return (
    <motion.div
      className="relative mb-6 h-60 w-full cursor-pointer rounded-2xl"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => setIsFlipped((prev) => !prev)}
      whileHover={{ scale: 1.02 }}
      role="button"
      aria-label="Flip payment card"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-2xl"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 opacity-90" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2)_0%,_transparent_50%)] opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium opacity-80">Virtual Payment Card</div>
            {getPaymentIcon()}
          </div>
          <div className="space-y-4">
            <div className="flex space-x-3">
              {[1, 2, 3, 4].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 w-6 rounded-full bg-white/60"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                />
              ))}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="mb-1 text-xs opacity-80">Deposit Amount</div>
                <motion.div
                  className="text-2xl font-bold"
                  key={amount}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {symbol}
                  {amount.toFixed(2)} {currency}
                </motion.div>
              </div>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-2xl"
        style={{ backfaceVisibility: "hidden", rotateY: 180 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-600 to-purple-800 opacity-90" />
        <div className="absolute left-0 right-0 top-0 mt-6 h-12 bg-zinc-800/50" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          <div className="flex justify-end">
            <div className="text-xs opacity-80">Flip to see front</div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex h-10 w-full items-center rounded-md bg-zinc-800/50 px-4">
              <div className="mr-auto text-xs opacity-70">Security Code</div>
              <div className="font-mono font-bold">***</div>
            </div>
            <div className="text-xs opacity-70">
              This is a virtual card. Use securely for online payments only.
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="h-3 w-3" />
              <span className="opacity-70">Protected with end-to-end encryption</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Stripe Card Form Component
const StripeCardForm = ({
  amount,
  currency,
  paymentCurrency,
  exchangeRates,
  onComplete,
}: {
  amount: number;
  currency: CurrencyCode;
  paymentCurrency: PaymentCurrency;
  exchangeRates: Record<string, number>;
  onComplete: (clientSecret: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const rate = exchangeRates[paymentCurrency] / exchangeRates[currency];
      const paymentAmount = amount * rate;

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(paymentAmount * 100),
          currency: paymentCurrency.toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const { clientSecret } = await response.json();
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) throw new Error("Card element not found");

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentError) throw new Error(paymentError.message);

      if (paymentIntent?.status === "succeeded") {
        onComplete(clientSecret);
      } else {
        throw new Error("Payment not completed");
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-element">Card Details</Label>
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-3">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#fff",
                  "::placeholder": { color: "#a1a1aa" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
      <Button
        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
        onClick={handleSubmit}
        disabled={processing || !stripe || !elements}
        aria-label={processing ? "Processing payment" : "Pay now"}
      >
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
};

// Payment Methods Configuration
const paymentMethods = [
  { id: "card" as const, label: "Credit Card", icon: CreditCard, component: StripeCardForm },
];

// Main Deposit Modal Component
export function DepositModal({
  isOpen,
  onClose,
  onDeposit,
  currencies,
  initialCurrency,
  exchangeRates,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>("USD");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("amount");

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  const handlePaymentMethodChange = useCallback((value: string) => {
    setPaymentMethod(value as PaymentMethod);
  }, []);

  const handlePaymentComplete = useCallback(
    (clientSecret: string) => {
      setPaymentStep("confirm");
      const parsedAmount = Number(amount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        onDeposit(currency, parsedAmount, paymentCurrency, clientSecret);
      }
    },
    [amount, currency, paymentCurrency, onDeposit]
  );

  const resetModal = useCallback(() => {
    setAmount("");
    setCurrency(initialCurrency);
    setPaymentMethod("card");
    setPaymentStep("amount");
    setPaymentCurrency("USD");
  }, [initialCurrency]);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  const SelectedPaymentComponent = paymentMethods.find((m) => m.id === paymentMethod)?.component;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make a Deposit</DialogTitle>
          <DialogDescription>Choose your amount and payment method</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {paymentStep === "amount" && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <FloatingCard
                amount={Number(amount) || 0}
                currency={currency}
                symbol={currencies[currency].symbol}
                paymentMethod={paymentMethod}
              />
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="border-zinc-700 bg-zinc-800 text-white"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value as CurrencyCode)}
                  required
                >
                  <SelectTrigger
                    className="border-zinc-700 bg-zinc-800 text-white"
                    id="currency"
                  >
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                    {Object.entries(currencies).map(([code, { name, symbol }]) => (
                      <SelectItem key={code} value={code}>
                        {code} - {name} ({symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-currency">Payment Currency</Label>
                <Select
                  value={paymentCurrency}
                  onValueChange={(value) => setPaymentCurrency(value as PaymentCurrency)}
                  required
                >
                  <SelectTrigger
                    className="border-zinc-700 bg-zinc-800 text-white"
                    id="payment-currency"
                  >
                    <SelectValue placeholder="Select payment currency" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                    {["USD", "EUR", "CNY", "JPY", "BRL"].map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
                onClick={() => setPaymentStep("payment")}
                disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
                aria-label="Continue to payment"
              >
                Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {paymentStep === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <FloatingCard
                amount={Number(amount) || 0}
                currency={currency}
                symbol={currencies[currency].symbol}
                paymentMethod={paymentMethod}
              />
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="grid grid-cols-1 gap-2"
                  aria-label="Payment methods"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id}>
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="sr-only"
                        aria-label={method.label}
                      />
                      <Label
                        htmlFor={method.id}
                        className="flex cursor-pointer items-center justify-start rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-sm text-white hover:bg-zinc-700"
                      >
                        <method.icon className="mr-2 h-4 w-4" />
                        {method.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {SelectedPaymentComponent && (
                <Elements stripe={stripePromise}>
                  <SelectedPaymentComponent
                    currency={currency}
                    amount={Number(amount)}
                    paymentCurrency={paymentCurrency}
                    exchangeRates={exchangeRates}
                    onComplete={handlePaymentComplete}
                  />
                </Elements>
              )}
              <Button
                variant="ghost"
                onClick={() => setPaymentStep("amount")}
                aria-label="Back to amount selection"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Back
              </Button>
            </motion.div>
          )}

          {paymentStep === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Check className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <h3 className="text-lg font-medium">Payment Successful!</h3>
                <p className="text-sm text-white/60">Your deposit is being processed.</p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/60">Amount:</div>
                  <div className="text-right font-medium text-white">
                    {currencies[currency].symbol}
                    {Number(amount).toFixed(2)} {currency}
                  </div>
                  <div className="text-white/60">Payment Method:</div>
                  <div className="text-right font-medium text-white">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
                onClick={handleClose}
                aria-label="Close modal"
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}