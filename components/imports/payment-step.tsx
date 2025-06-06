import { Check, CreditCard, DollarSign, QrCode, Wallet } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";
import type { UseFormWatch } from "react-hook-form";

import type { ImportFormValues } from "@/types/types";

// Define payment methods as a union type for better type safety
type PaymentMethod = "balance" | "credit" | "debit" | "paypal" | "pix";

interface PaymentStepProps {
  watch: UseFormWatch<ImportFormValues>;
  formatCurrency: (value: string) => string;
  getCountryName: (countryCode: string) => string;
  getCategoryName: (categoryCode: string) => string;
  getCountryFlag: (countryCode: string) => string | StaticImageData;
  calculateFees: (amount: string, method: PaymentMethod) => number;
  calculateTotal: (amount: string, method: PaymentMethod) => number;
}

export function PaymentStep({
  watch,
  formatCurrency,
  getCountryName,
  getCategoryName,
  getCountryFlag,
  calculateFees,
  calculateTotal,
}: PaymentStepProps) {
  // Use useMemo for watched values to prevent unnecessary re-renders
  const paymentMethod = useMemo(() => watch("paymentMethod"), [watch]);
  const externalPaymentMethod = useMemo(
    () => watch("externalPaymentMethod") as PaymentMethod,
    [watch],
  );
  const productValue = useMemo(() => watch("productValue") ?? "0", [watch]);
  const originCountry = useMemo(() => watch("originCountry"), [watch]);
  const productCategory = useMemo(() => watch("productCategory"), [watch]);

  // Handle copy Pix key functionality
  const handleCopyPixKey = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        "00020126580014br.gov.bcb.pix0136a629534e-7693-46c6-8b91-8a15d60534df5204000053039865802BR5925John Doe6009Sao Paulo62070503***63041234",
      );
      // You might want to add a toast notification here
    } catch (error) {
      console.error("Failed to copy Pix key:", error);
    }
  }, []);

  // Component for rendering import summary (to reduce code duplication)
  const ImportSummary = useCallback(
    () => (
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h3 className="text-md font-medium mb-3">Import Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Product</span>
            <span className="font-medium">{getCategoryName(productCategory ?? "")}</span>
          </div>
          {originCountry && (
            <div className="flex justify-between items-center">
              <span className="text-white/70">Origin</span>
              <div className="flex items-center">
                <Image
                  src={getCountryFlag(originCountry)}
                  alt={`${getCountryName(originCountry)} flag`}
                  width={16}
                  height={12}
                  className="h-3 mr-2"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <span className="font-medium">{getCountryName(originCountry)}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-white/70">Value</span>
            <span className="font-medium">{formatCurrency(productValue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Payment Method</span>
            <div className="flex items-center">
              <Wallet className="h-4 w-4 mr-1 text-indigo-400" />
              <span className="font-medium">Account Balance</span>
            </div>
          </div>
        </div>
      </div>
    ),
    [
      formatCurrency,
      getCategoryName,
      getCountryFlag,
      getCountryName,
      originCountry,
      productCategory,
      productValue,
    ],
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold mb-1">Payment</h2>
        <p className="text-white/60 text-sm">
          Complete your payment to proceed with the import
        </p>
      </header>

      {paymentMethod === "balance" ? (
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Account Balance Payment</h3>
              <Wallet className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Current Balance</span>
                <span className="font-medium">R$ 2,500.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Import Amount</span>
                <span className="font-medium text-rose-400">
                  - {formatCurrency(productValue)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Remaining Balance</span>
                <span className="font-bold text-lg">
                  {formatCurrency(
                    (2500 - Number.parseFloat(productValue)).toFixed(2),
                  )}
                </span>
              </div>
            </div>
          </div>

          <ImportSummary />

          <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/30">
            <div className="flex items-start">
              <div className="bg-indigo-500/20 p-2 rounded-full mr-3">
                <Check className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-medium text-indigo-300">Ready to Complete</h4>
                <p className="text-sm text-white/70">
                  Your account has sufficient funds for this import. Click the
                  button below to confirm and complete your purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {(externalPaymentMethod === "credit" ||
            externalPaymentMethod === "debit") && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    {externalPaymentMethod === "credit" ? "Credit" : "Debit"} Card
                    Payment
                  </h3>
                  <CreditCard className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/30 mb-4">
                  <div className="flex items-start">
                    <div className="bg-indigo-500/20 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-300">
                        Card Details Saved
                      </h4>
                      <p className="text-sm text-white/70">
                        Your card details have been saved. Click the button below
                        to complete your payment.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded mr-3" />
                      <div>
                        <p className="font-medium">
                          •••• •••• ••••{" "}
                          {watch("creditCard.number")?.slice(-4) ?? "1234"}
                        </p>
                        <p className="text-xs text-white/60">
                          Expires {watch("creditCard.expiry") ?? "12/25"}
                        </p>
                      </div>
                    </div>
                    <CreditCard className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Import Amount</span>
                    <span className="font-medium">
                      {formatCurrency(productValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">
                      Processing Fee (
                      {externalPaymentMethod === "credit" ? "2%" : "1%"})
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        calculateFees(productValue, externalPaymentMethod).toFixed(
                          2,
                        ),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(
                        calculateTotal(
                          productValue,
                          externalPaymentMethod,
                        ).toFixed(2),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {externalPaymentMethod === "paypal" && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">PayPal Payment</h3>
                  <DollarSign className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30 mb-4">
                  <div className="flex items-start">
                    <Image
                      src="/paypal-logo.png"
                      alt="PayPal"
                      width={32}
                      height={32}
                      className="h-8 w-8 mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-blue-300">
                        Ready to Connect with PayPal
                      </h4>
                      <p className="text-sm text-white/70">
                        You&apos;ll be redirected to PayPal to complete your
                        payment securely.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">PayPal Account</p>
                      <p className="text-sm text-white/60">
                        {watch("paypalEmail") ?? "user@example.com"}
                      </p>
                    </div>
                    <DollarSign className="h-5 w-5 text-white/40" />
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Import Amount</span>
                    <span className="font-medium">
                      {formatCurrency(productValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">PayPal Fee (2.5%)</span>
                    <span className="font-medium">
                      {formatCurrency(
                        calculateFees(productValue, "paypal").toFixed(2),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(
                        calculateTotal(productValue, "paypal").toFixed(2),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {externalPaymentMethod === "pix" && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Pix Payment</h3>
                  <QrCode className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <Image
                        src="/pix-qr.png"
                        alt="Pix QR Code"
                        width={192}
                        height={192}
                        className="w-48 h-48"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 mb-2">
                        Scan the QR code with your banking app
                      </p>
                      <p className="text-sm text-white/60">
                        Or copy the Pix key below
                      </p>
                    </div>
                    <div className="mt-4 w-full">
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-md p-2">
                        <code className="text-sm text-white/80 flex-1 truncate px-2">
                          00020126580014br.gov.bcb.pix0136a629534e-7693-46c6-8b91-8a15d60534df5204000053039865802BR5925John
                          Doe6009Sao Paulo62070503***63041234
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyPixKey}
                          className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-medium mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/70">Import Amount</span>
                    <span className="font-medium">
                      {formatCurrency(productValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(productValue)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/30">
                <div className="flex items-start">
                  <div className="bg-amber-500/20 p-2 rounded-full mr-3">
                    <Check className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-300">
                      Payment Pending
                    </h4>
                    <p className="text-sm text-white/70">
                      After making the payment, click &quot;Continue&quot; to
                      proceed. Your import will be processed once the payment is
                      confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}