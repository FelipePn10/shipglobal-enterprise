"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  BanknoteIcon,
  CreditCardIcon,
  DollarSign,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo } from "react";
import type {
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import type { ImportFormValues } from "@/types/types";

// Define payment methods as a union type for type safety
type PaymentMethod = "credit" | "debit" | "paypal" | "pix";

// Define fee structure for clarity
const FEE_RATES: Record<PaymentMethod, { rate: number; label: string }> = {
  credit: { rate: 0.02, label: "Processing Fee (2%)" },
  debit: { rate: 0.01, label: "Processing Fee (1%)" },
  paypal: { rate: 0.025, label: "PayPal Fee (2.5%)" },
  pix: { rate: 0, label: "No fees" },
};

interface PaymentOptionsProps {
  control: Control<ImportFormValues>;
  watch: UseFormWatch<ImportFormValues>;
  setValue: UseFormSetValue<ImportFormValues>;
  productValue: string;
  formatCurrency: (value: string) => string;
  calculateFees: (amount: string, method: PaymentMethod) => number;
  calculateTotal: (amount: string, method: PaymentMethod) => number;
}

export function PaymentOptions({
  control,
  watch,
  setValue,
  productValue,
  formatCurrency,
  calculateFees,
  calculateTotal,
}: PaymentOptionsProps) {
  // Memoize watched value to prevent unnecessary re-renders
  const externalPaymentMethod = useMemo(
    () => watch("externalPaymentMethod") as PaymentMethod | undefined,
    [watch],
  );

  // Format helpers
  const formatCardNumber = useCallback((value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .slice(0, 19);
  }, []);

  const formatExpiryDate = useCallback((value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/, "$1/")
      .slice(0, 5);
  }, []);

  // Handle Pix key copying
  const handleCopyPixKey = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        "00020126580014br.gov.bcb.pix0136a629534e-7693-46c6-8b91",
      );
      // Consider adding a toast notification here
    } catch (error) {
      console.error("Failed to copy Pix key:", error);
    }
  }, []);

  // Set default payment method
  useEffect(() => {
    if (!externalPaymentMethod) {
      setValue("externalPaymentMethod", "credit");
    }
  }, [externalPaymentMethod, setValue]);

  // Render payment summary to reduce duplication
  const PaymentSummary = useCallback(
    () => (
      <div className="bg-white/5 p-3 mt-4 rounded-md border border-white/10">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium">Payment Summary</span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Import Amount</span>
            <span className="font-medium">
              {formatCurrency(productValue || "0")}
            </span>
          </div>
          {externalPaymentMethod && (
            <div className="flex justify-between items-center">
              <span className="text-white/70">
                {FEE_RATES[externalPaymentMethod].label}
              </span>
              <span className="font-medium">
                {formatCurrency(
                  calculateFees(productValue, externalPaymentMethod).toFixed(2),
                )}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1 border-t border-white/10 mt-1">
            <span className="font-medium">Total</span>
            <span className="font-bold">
              {externalPaymentMethod
                ? formatCurrency(
                    calculateTotal(
                      productValue,
                      externalPaymentMethod,
                    ).toFixed(2),
                  )
                : formatCurrency(productValue || "0")}
            </span>
          </div>
        </div>
      </div>
    ),
    [
      calculateFees,
      calculateTotal,
      externalPaymentMethod,
      formatCurrency,
      productValue,
    ],
  );

  return (
    <div className="mt-4 pl-4 border-l-2 border-indigo-500/30">
      <FormField
        control={control}
        name="externalPaymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Select Payment Method</FormLabel>
            <FormControl>
              <Tabs
                value={field.value || "credit"}
                onValueChange={(value) => {
                  const paymentMethod = value as PaymentMethod;
                  field.onChange(paymentMethod);
                  // Reset specific payment fields
                  if (paymentMethod !== "credit" && paymentMethod !== "debit") {
                    setValue("creditCard", {
                      number: "",
                      expiry: "",
                      cvc: "",
                      name: "",
                      saveCard: false,
                    });
                  }
                  if (paymentMethod !== "paypal") {
                    setValue("paypalEmail", "");
                  }
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4 bg-white/5">
                  <TabsTrigger
                    value="credit"
                    className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
                  >
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger
                    value="debit"
                    className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
                  >
                    <BanknoteIcon className="h-4 w-4 mr-2" />
                    Debit Card
                  </TabsTrigger>
                  <TabsTrigger
                    value="paypal"
                    className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    PayPal
                  </TabsTrigger>
                  <TabsTrigger
                    value="pix"
                    className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Pix
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="credit" className="mt-0">
                  <div className="bg-white/5 p-4 rounded-md border border-white/10">
                    <div className="grid gap-4">
                      <FormField
                        control={control}
                        name="creditCard.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="0000 0000 0000 0000"
                                  {...field}
                                  value={formatCardNumber(field.value || "")}
                                  onChange={(e) =>
                                    field.onChange(
                                      formatCardNumber(e.target.value),
                                    )
                                  }
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                  <div className="w-6 h-4 bg-white/10 rounded" />
                                  <div className="w-6 h-4 bg-white/10 rounded" />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name="creditCard.expiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MM/YY"
                                  {...field}
                                  value={formatExpiryDate(field.value || "")}
                                  onChange={(e) =>
                                    field.onChange(
                                      formatExpiryDate(e.target.value),
                                    )
                                  }
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="creditCard.cvc"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>CVC</FormLabel>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 text-white/40"
                                      >
                                        <AlertCircle className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-900 border-white/10">
                                      <p>
                                        3 or 4 digit security code on the back of
                                        your card
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <FormControl>
                                <Input
                                  placeholder="123"
                                  maxLength={4}
                                  {...field}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={control}
                        name="creditCard.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between pt-2">
                        <FormField
                          control={control}
                          name="creditCard.saveCard"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                Save this card for future payments
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-1 text-green-400" />
                          <span className="text-xs text-white/60">
                            Secure payment
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="debit" className="mt-0">
                  <div className="bg-white/5 p-4 rounded-md border border-white/10">
                    <div className="grid gap-4">
                      <FormField
                        control={control}
                        name="creditCard.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="0000 0000 0000 0000"
                                  {...field}
                                  value={formatCardNumber(field.value || "")}
                                  onChange={(e) =>
                                    field.onChange(
                                      formatCardNumber(e.target.value),
                                    )
                                  }
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                  <div className="w-6 h-4 bg-white/10 rounded" />
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name="creditCard.expiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="MM/YY"
                                  {...field}
                                  value={formatExpiryDate(field.value || "")}
                                  onChange={(e) =>
                                    field.onChange(
                                      formatExpiryDate(e.target.value),
                                    )
                                  }
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="creditCard.cvc"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>CVC</FormLabel>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 text-white/40"
                                      >
                                        <AlertCircle className="h-3 w-3" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-900 border-white/10">
                                      <p>
                                        3 or 4 digit security code on the back of
                                        your card
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <FormControl>
                                <Input
                                  placeholder="123"
                                  maxLength={4}
                                  {...field}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={control}
                        name="creditCard.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name on Card</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between pt-2">
                        <FormField
                          control={control}
                          name="creditCard.saveCard"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                Save this card for future payments
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-1 text-green-400" />
                          <span className="text-xs text-white/60">
                            Secure payment
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="paypal" className="mt-0">
                  <div className="bg-white/5 p-4 rounded-md border border-white/10">
                    <div className="grid gap-4">
                      <FormField
                        control={control}
                        name="paypalEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PayPal Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your-email@example.com"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="bg-blue-500/10 p-3 rounded-md border border-blue-500/20 flex items-center text-sm">
                        <Image
                          src="/paypal-logo.png"
                          alt="PayPal"
                          width={24}
                          height={24}
                          className="h-6 w-6 mr-2"
                        />
                        <span>
                          You&apos;ll be redirected to PayPal to complete your
                          payment
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-white/60">
                          Transaction Fee: {FEE_RATES.paypal.rate * 100}%
                        </span>
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-1 text-green-400" />
                          <span className="text-xs text-white/60">
                            Secure payment
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pix" className="mt-0">
                  <div className="bg-white/5 p-4 rounded-md border border-white/10">
                    <div className="flex flex-col items-center justify-center p-3 space-y-3">
                      <p className="text-sm text-white/80 mb-1">
                        Scan this QR code with your banking app
                      </p>
                      <div className="bg-white p-3 rounded-lg">
                        <Image
                          src="/pix-qr.png"
                          alt="Pix QR Code"
                          width={144}
                          height={144}
                          className="w-36 h-36"
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-sm text-white/80 mb-1">
                          Or use this Pix key
                        </p>
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-md p-2">
                          <code className="text-sm text-white/80 flex-1 truncate px-2">
                            00020126580014br.gov.bcb.pix0136a629534e-7693-46c6-8b91
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleCopyPixKey}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between w-full items-center pt-2">
                        <span className="text-xs text-white/60">
                          No transaction fees
                        </span>
                        <span className="text-xs text-white/60">
                          Expires in 30 minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PaymentSummary />
    </div>
  );
}