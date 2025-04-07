"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  CreditCard,
  ArrowRight,
  Check,
  Shield,
  Sparkles,
  Gift,
  QrCode,
  Copy,
  AlertCircle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import type { LucideIcon } from "lucide-react";
import { JSX } from "react/jsx-runtime";

// Tipos
type CurrencyCode = "USD" | "EUR" | "CNY" | "JPY";
type PaymentMethod = "card" | "paypal" | "apple" | "crypto" | "pix";
type PaymentStep = "amount" | "payment" | "details" | "confirm";

interface CurrencyDetails {
  symbol: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (currency: CurrencyCode, amount: number) => void;
  currencies: Record<CurrencyCode, CurrencyDetails>;
  initialCurrency: CurrencyCode;
  balances: Record<string, { amount: number; lastUpdated: string }>;
}

// Componente FloatingCard
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
      paypal: <Gift className="h-8 w-8 opacity-80" />,
      apple: <Shield className="h-8 w-8 opacity-80" />,
      crypto: <Sparkles className="h-8 w-8 opacity-80" />,
      pix: <QrCode className="h-8 w-8 opacity-80" />,
    };
    return icons[paymentMethod];
  }, [paymentMethod]);

  return (
    <motion.div
      className="w-full h-60 rounded-2xl perspective-card mb-6 cursor-pointer relative"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => setIsFlipped((prev) => !prev)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Frente do cartão */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
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
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-center">
            <div className="text-xs opacity-80 font-medium">Virtual Payment Card</div>
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
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-80 mb-1">Deposit Amount</div>
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
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Verso do cartão */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
        style={{ backfaceVisibility: "hidden", rotateY: 180, transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-600 to-purple-800 opacity-90" />
        <div className="absolute top-0 left-0 right-0 h-12 bg-zinc-800/50 mt-6" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex justify-end">
            <div className="text-xs opacity-80">Flip to see front</div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="w-full bg-zinc-800/50 h-10 rounded-md flex items-center px-4">
              <div className="text-xs opacity-70 mr-auto">Security Code</div>
              <div className="font-mono font-bold">***</div>
            </div>
            <div className="text-xs opacity-70">This is a virtual card. Use securely for online payments only.</div>
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

// Componente CreditCardForm
const CreditCardForm = ({ onComplete }: { onComplete: () => void }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"cardNumber" | "cardName" | "expiry" | "cvv", string>>>({});

  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = cleanValue.match(/\d{4,16}/g)?.[0]?.match(/.{1,4}/g) || [];
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string): string => {
    const cleanValue = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return cleanValue.length >= 3 ? `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}` : value;
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<"cardNumber" | "cardName" | "expiry" | "cvv", string>> = {};

    if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 16) {
      newErrors.cardNumber = "Valid card number is required (16 digits)";
    }
    if (!cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }
    if (!expiry || expiry.length < 5) {
      newErrors.expiry = "Valid expiry date is required (MM/YY)";
    } else {
      const [month, year] = expiry.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (month < 1 || month > 12) {
        newErrors.expiry = "Invalid month";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = "Card has expired";
      }
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required (3-4 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [cardNumber, cardName, expiry, cvv]);

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-number">Card Number</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            id="card-number"
            placeholder="1234 5678 9012 3456"
            className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
          />
        </div>
        {errors.cardNumber && (
          <p className="text-red-400 text-xs mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.cardNumber}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-name">Cardholder Name</Label>
        <Input
          id="card-name"
          placeholder="John Doe"
          className="bg-zinc-800 border-zinc-700 text-white"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        {errors.cardName && (
          <p className="text-red-400 text-xs mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.cardName}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            className="bg-zinc-800 border-zinc-700 text-white"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={5}
          />
          {errors.expiry && (
            <p className="text-red-400 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.expiry}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="123"
            className="bg-zinc-800 border-zinc-700 text-white"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={4}
          />
          {errors.cvv && (
            <p className="text-red-400 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
        onClick={handleSubmit}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

// Componente CryptoPayment
const CryptoPayment = ({
  currency,
  amount,
  onComplete,
}: {
  currency: CurrencyCode;
  amount: number;
  onComplete: () => void;
}) => {
  const walletAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [walletAddress]);

  return (
    <div className="space-y-4">
      <div className="bg-zinc-800 rounded-lg p-4 text-center">
        <div className="text-white/60 text-sm mb-2">Scan QR Code to Pay</div>
        <div className="w-48 h-48 mx-auto bg-white p-2 rounded-lg">
          <div className="w-full h-full bg-[url('/placeholder.svg?height=180&width=180')] bg-center bg-no-repeat bg-contain" />
        </div>
        <div className="mt-2 text-white/80 text-sm">
          Send exactly <span className="font-bold text-white">{amount.toFixed(8)} BTC</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Wallet Address</Label>
        <div className="flex">
          <Input
            value={walletAddress}
            readOnly
            className="bg-zinc-800 border-zinc-700 text-white rounded-r-none"
          />
          <Button
            variant="outline"
            className="border-zinc-700 border-l-0 rounded-l-none text-white/80 hover:bg-zinc-700"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="text-white/60 text-sm mb-2">Payment Details</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-white/60">Amount:</div>
          <div className="text-white font-medium text-right">{amount.toFixed(8)} BTC</div>
          <div className="text-white/60">Network:</div>
          <div className="text-white font-medium text-right">Bitcoin</div>
          <div className="text-white/60">Confirmation Required:</div>
          <div className="text-white font-medium text-right">3 blocks</div>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
        onClick={onComplete}
      >
        I&apos;ve Completed the Payment
      </Button>
    </div>
  );
};

// Componente PixPayment
const PixPayment = ({
  currency,
  amount,
  onComplete,
}: {
  currency: CurrencyCode;
  amount: number;
  onComplete: () => void;
}) => {
  const pixCode = "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000";
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pixCode]);

  return (
    <div className="space-y-4">
      <div className="bg-zinc-800 rounded-lg p-4 text-center">
        <div className="text-white/60 text-sm mb-2">Scan PIX QR Code</div>
        <div className="w-48 h-48 mx-auto bg-white p-2 rounded-lg">
          <div className="w-full h-full bg-[url('/placeholder.svg?height=180&width=180')] bg-center bg-no-repeat bg-contain" />
        </div>
        <div className="mt-2 text-white/80 text-sm">
          Amount: <span className="font-bold text-white">R$ {(amount * 5).toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>PIX Code</Label>
        <div className="flex">
          <Input
            value={pixCode}
            readOnly
            className="bg-zinc-800 border-zinc-700 text-white rounded-r-none font-mono text-xs"
          />
          <Button
            variant="outline"
            className="border-zinc-700 border-l-0 rounded-l-none text-white/80 hover:bg-zinc-700"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="text-white/60 text-sm mb-2">Payment Details</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-white/60">Amount:</div>
          <div className="text-white font-medium text-right">R$ {(amount * 5).toFixed(2)}</div>
          <div className="text-white/60">Recipient:</div>
          <div className="text-white font-medium text-right">Your Company Name</div>
          <div className="text-white/60">Processing Time:</div>
          <div className="text-white font-medium text-right">Instant</div>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
        onClick={onComplete}
      >
        I&apos;ve Completed the Payment
      </Button>
    </div>
  );
};

// Componente ApplePayment
const ApplePayment = ({
  currency,
  amount,
  onComplete,
}: {
  currency: CurrencyCode;
  amount: number;
  onComplete: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <div className="text-white/60 text-sm mb-4">Pay with Apple Pay</div>
        <motion.button
          className="w-full py-4 px-6 bg-black rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
        >
          <svg viewBox="0 0 43 20" width="43" height="20" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
            <path
              d="M42.5 8.5c0-1.4-0.4-2.6-1.2-3.5-0.8-1-1.9-1.5-3.3-1.5-1.4 0-2.5 0.5-3.3 1.5-0.8 1-1.2 2.1-1.2 3.5 0 1.4 0.4 2.6 1.2 3.5 0.8 1 1.9 1.5 3.3 1.5 0.7 0 1.3-0.1 1.9-0.4 0.6-0.3 1-0.6 1.4-1.1l0.1-0.1-0.7-0.7-0.1 0.1c-0.3 0.3-0.6 0.6-1 0.8-0.4 0.2-0.9 0.3-1.4 0.3-1 0-1.8-0.4-2.4-1.1-0.6-0.7-0.9-1.6-0.9-2.8 0-1.1 0.3-2.1 0.9-2.8 0.6-0.7 1.4-1.1 2.4-1.1 1 0 1.8 0.4 2.4 1.1 0.6 0.7 0.9 1.6 0.9 2.8v0.4h-5.7v1h6.7zM30.7 13.4h1.1V3.6h-1.1v9.8zM28.6 7.2c-0.5-0.3-1.1-0.5-1.7-0.5-1.3 0-2.3 0.5-3.1 1.5-0.8 1-1.2 2.1-1.2 3.5 0 1.4 0.4 2.5 1.2 3.5 0.8 1 1.8 1.4 3.1 1.4 0.7 0 1.2-0.2 1.7-0.5 0.5-0.3 0.9-0.7 1.1-1.2l0.1-0.2 0.1 1.7h0.9V6.9h-1.1v1.5l-0.1-0.2c-0.2-0.4-0.5-0.8-1-1zM28.8 12c-0.6 0.7-1.3 1.1-2.2 1.1-0.9 0-1.7-0.3-2.2-1-0.6-0.7-0.8-1.6-0.8-2.7 0-1.1 0.3-2 0.8-2.7 0.6-0.7 1.3-1 2.2-1 0.9 0 1.7 0.3 2.2 1 0.6 0.7 0.8 1.6 0.8 2.7 0.1 1.1-0.2 2-0.8 2.6zM19.5 6.9h-1.1v6.5h1.1V6.9zM19.5 3.6h-1.1v1.1h1.1V3.6zM17.1 9.3c0-0.8-0.2-1.5-0.7-2-0.5-0.5-1.1-0.7-1.9-0.7-0.5 0-1 0.1-1.4 0.4-0.4 0.3-0.7 0.6-0.9 1l-0.1 0.2V6.9h-1.1v6.5h1.1v-3.6c0-0.7 0.2-1.2 0.5-1.6 0.3-0.4 0.8-0.6 1.4-0.6 0.5 0 0.9 0.2 1.2 0.5 0.3 0.3 0.4 0.8 0.4 1.4v3.9h1.1V9.3zM6.5 13.4h1.1V3.6H6.5v9.8zM4.1 6.9H3v6.5h1.1V6.9zM4.1 3.6H3v1.1h1.1V3.6z"
              fill="white"
            />
          </svg>
        </motion.button>
        <div className="mt-4 text-white/80 text-sm">
          Amount: <span className="font-bold text-white">{amount.toFixed(2)} {currency}</span>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="text-white/60 text-sm mb-2">Payment Details</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-white/60">Amount:</div>
          <div className="text-white font-medium text-right">{amount.toFixed(2)} {currency}</div>
          <div className="text-white/60">Processing Time:</div>
          <div className="text-white font-medium text-right">Instant</div>
          <div className="text-white/60">Fee:</div>
          <div className="text-white font-medium text-right">No fee</div>
        </div>
      </div>

      <div className="text-center text-xs text-white/60 flex items-center justify-center mt-4">
        <Shield className="h-3 w-3 mr-1" />
        Secured with Apple Pay&apos;s end-to-end encryption
      </div>
    </div>
  );
};

// Componente PayPalPayment
const PayPalPayment = ({
  currency,
  amount,
  onComplete,
}: {
  currency: CurrencyCode;
  amount: number;
  onComplete: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-zinc-800 rounded-lg p-6 text-center">
        <div className="text-white/60 text-sm mb-4">Pay with PayPal</div>
        <motion.button
          className="w-full py-3 px-6 bg-[#0070ba] rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="124" height="33" viewBox="0 0 124 33" className="h-8 w-auto">
            <path
              d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.432h.436c1.96 0 3.403-.412 4.268-1.218.865-.804 1.25-1.946 1.103-3.221zm14.772.836h-3.275a.57.57 0 0 0-.563.432l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.659zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.31"
              fill="#fff"
            />
            <path
              d="M87.41 13.99h-3.275a.57.57 0 0 0-.563.432l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.659zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.31"
              fill="#fff"
            />
            <path
              d="M117.74 13.99h-3.275a.57.57 0 0 0-.563.432l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.659zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.31"
              fill="#003087"
            />
          </svg>
        </motion.button>
        <div className="mt-4 text-white/80 text-sm">
          Amount: <span className="font-bold text-white">{amount.toFixed(2)} {currency}</span>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="text-white/60 text-sm mb-2">Payment Details</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-white/60">Amount:</div>
          <div className="text-white font-medium text-right">{amount.toFixed(2)} {currency}</div>
          <div className="text-white/60">Processing Time:</div>
          <div className="text-white font-medium text-right">Instant</div>
          <div className="text-white/60">Fee:</div>
          <div className="text-white font-medium text-right">No fee</div>
        </div>
      </div>

      <div className="text-center text-xs text-white/60 flex items-center justify-center mt-4">
        <Shield className="h-3 w-3 mr-1" />
        Secured with PayPal&apos;s end-to-end encryption
      </div>
    </div>
  );
};

// Definição dos métodos de pagamento
const paymentMethods = [
  { id: "card" as const, label: "Credit Card", icon: CreditCard, component: CreditCardForm },
  { id: "paypal" as const, label: "PayPal", icon: Gift, component: PayPalPayment },
  { id: "apple" as const, label: "Apple Pay", icon: Shield, component: ApplePayment },
  { id: "crypto" as const, label: "Crypto", icon: Sparkles, component: CryptoPayment },
  { id: "pix" as const, label: "PIX", icon: QrCode, component: PixPayment },
];

// Componente Principal
export function DepositModal({ isOpen, onClose, onDeposit, currencies, initialCurrency, balances }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("amount");

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  const handlePaymentMethodChange = useCallback((value: string) => {
    setPaymentMethod(value as PaymentMethod); // Conversão segura devido à correspondência com paymentMethods
  }, []);

  const handleDeposit = useCallback(() => {
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }
    onDeposit(currency, parsedAmount);
    onClose();
  }, [amount, currency, onDeposit, onClose]);

  const handlePaymentComplete = useCallback(() => {
    setPaymentStep("confirm");
  }, []);

  const resetModal = useCallback(() => {
    setAmount("");
    setCurrency(initialCurrency);
    setPaymentMethod("card");
    setPaymentStep("amount");
  }, [initialCurrency]);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  const SelectedPaymentComponent = paymentMethods.find((m) => m.id === paymentMethod)?.component;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 text-white border border-zinc-800 sm:max-w-md">
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
                  className="bg-zinc-800 border-zinc-700 text-white"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
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
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
                onClick={() => setPaymentStep("payment")}
                disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
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
                  className="grid grid-cols-2 gap-2"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id}>
                      <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center justify-start text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 p-2 cursor-pointer"
                      >
                        <method.icon className="h-4 w-4 mr-2" />
                        {method.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {SelectedPaymentComponent && (
                <SelectedPaymentComponent
                  currency={currency}
                  amount={Number(amount)}
                  onComplete={handlePaymentComplete}
                />
              )}
              <Button variant="ghost" onClick={() => setPaymentStep("amount")}>
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
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
                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Payment Successful!</h3>
                <p className="text-sm text-white/60">Your deposit is being processed.</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/60">Amount:</div>
                  <div className="text-white font-medium text-right">
                    {currencies[currency].symbol}
                    {Number(amount).toFixed(2)} {currency}
                  </div>
                  <div className="text-white/60">Payment Method:</div>
                  <div className="text-white font-medium text-right">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setPaymentStep("payment")}>
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Back
                </Button>
                <Button
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
                  onClick={handleDeposit}
                >
                  Complete Deposit
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}