import { Check, CreditCard, DollarSign, QrCode, Wallet } from "lucide-react"
import type { ImportFormValues } from "@/types/types"
import type { UseFormGetValues } from "react-hook-form"
import Image from "next/image"

interface PaymentConfirmationProps {
  getValues: UseFormGetValues<ImportFormValues>
  formatCurrency: (value: string) => string
  getCountryName: (countryCode: string) => string
  getCategoryName: (categoryCode: string) => string
  getCountryFlag: (countryCode: string) => string
  paymentMethod: "balance" | "external"
  externalPaymentMethod?: "credit" | "debit" | "paypal" | "pix"
}

export function PaymentConfirmation({
  getValues,
  formatCurrency,
  getCountryName,
  getCategoryName,
  getCountryFlag,
  paymentMethod,
  externalPaymentMethod,
}: PaymentConfirmationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Confirmation</h2>
        <p className="text-white/60 text-sm">Your import has been successfully created</p>
      </div>

      <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/30 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500/20 p-3 rounded-full">
            <Check className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-green-300 mb-2">Import Created Successfully!</h3>
        <p className="text-white/70 mb-4">Your import request has been received and is being processed.</p>
        <div className="inline-block bg-white/10 rounded-lg px-4 py-2 mb-4">
          <p className="text-sm text-white/60">Import ID</p>
          <p className="font-mono font-medium">IMP-2023-0043</p>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-lg border border-white/10">
        <h3 className="text-lg font-medium mb-4">Import Summary</h3>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-1">Product</h4>
              <p className="font-medium truncate">{getValues("productLink")}</p>
              <p className="text-sm text-white/70">{getCategoryName(getValues("productCategory"))}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-white/60 mb-1">Value</h4>
              <p className="font-medium">{formatCurrency(getValues("productValue"))}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/60 mb-1">Origin</h4>
            <div className="flex items-center">
              {getValues("originCountry") && (
                <Image
                  src={getCountryFlag(getValues("originCountry")) || "/placeholder.svg"}
                  alt={getCountryName(getValues("originCountry"))}
                  className="h-4 mr-2"
                />
              )}
              <p className="font-medium">{getCountryName(getValues("originCountry"))}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/60 mb-1">Shipping Address</h4>
            <p className="font-medium">
              {getValues("address.street")}, {getValues("address.number")}
              {getValues("address.complement") ? `, ${getValues("address.complement")}` : ""} -{" "}
              {getValues("address.neighborhood")}
            </p>
            <p className="text-sm text-white/70">
              {getValues("address.city")}, {getValues("address.state")} - {getValues("address.zipCode")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/60 mb-1">Payment Method</h4>
            <div className="flex items-center">
              {paymentMethod === "balance" ? (
                <>
                  <Wallet className="h-4 w-4 mr-2 text-indigo-400" />
                  <span>Account Balance</span>
                </>
              ) : externalPaymentMethod === "credit" ? (
                <>
                  <CreditCard className="h-4 w-4 mr-2 text-indigo-400" />
                  <span>Credit Card</span>
                </>
              ) : externalPaymentMethod === "debit" ? (
                <>
                  <CreditCard className="h-4 w-4 mr-2 text-indigo-400" />
                  <span>Debit Card</span>
                </>
              ) : externalPaymentMethod === "paypal" ? (
                <>
                  <DollarSign className="h-4 w-4 mr-2 text-indigo-400" />
                  <span>PayPal</span>
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2 text-indigo-400" />
                  <span>Pix</span>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white/60 mb-1">Estimated Delivery</h4>
            <p className="font-medium">10-15 business days</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h4 className="font-medium mb-3">What's Next?</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-indigo-500/20 p-1 rounded-full mr-3 mt-0.5">
              <Check className="h-3 w-3 text-indigo-400" />
            </div>
            <p className="text-sm text-white/70">You'll receive an email confirmation with your import details.</p>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-500/20 p-1 rounded-full mr-3 mt-0.5">
              <Check className="h-3 w-3 text-indigo-400" />
            </div>
            <p className="text-sm text-white/70">
              Our team will process your import request and keep you updated on its status.
            </p>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-500/20 p-1 rounded-full mr-3 mt-0.5">
              <Check className="h-3 w-3 text-indigo-400" />
            </div>
            <p className="text-sm text-white/70">You can track your import status on the dashboard at any time.</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

