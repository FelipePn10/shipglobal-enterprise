"use client"

import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, Wallet } from "lucide-react"
import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form"
import type { ImportFormValues } from "@/types/types"
import { PaymentOptions } from "@/components/imports/payment-options"

interface PaymentMethodSelectorProps {
  control: Control<ImportFormValues>
  watch: UseFormWatch<ImportFormValues>
  setValue: UseFormSetValue<ImportFormValues>
  formatCurrency: (value: string) => string
  calculateFees: (amount: string, method: string) => number
  calculateTotal: (amount: string, method: string) => number
}

export function PaymentMethodSelector({
  control,
  watch,
  setValue,
  formatCurrency,
  calculateFees,
  calculateTotal,
}: PaymentMethodSelectorProps) {
  const paymentMethod = watch("paymentMethod")
  const productValue = watch("productValue")

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <h3 className="text-md font-medium mb-3 flex items-center">
        <DollarSign className="h-4 w-4 mr-2 text-indigo-400" />
        Payment Method
      </h3>

      <FormField
        control={control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value)
                  // Set default external payment method when switching to external
                  if (value === "external") {
                    setValue("externalPaymentMethod", "credit")
                  }
                }}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="balance" id="balance" className="peer sr-only" />
                  </FormControl>
                  <Label
                    htmlFor="balance"
                    className="flex flex-col items-start justify-between rounded-md border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/10 [&:has([data-state=checked])]:border-indigo-500 [&:has([data-state=checked])]:bg-indigo-500/10"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 mr-3 text-indigo-400" />
                        <div>
                          <p className="font-medium">Account Balance</p>
                          <p className="text-sm text-white/60">Deduct from your account balance</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="ml-auto bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      >
                        Recommended
                      </Badge>
                    </div>
                  </Label>
                </FormItem>

                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="external" id="external" className="peer sr-only" />
                  </FormControl>
                  <Label
                    htmlFor="external"
                    className="flex flex-col items-start justify-between rounded-md border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-white/20 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/10 [&:has([data-state=checked])]:border-indigo-500 [&:has([data-state=checked])]:bg-indigo-500/10"
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-3 text-indigo-400" />
                      <div>
                        <p className="font-medium">Pay Separately</p>
                        <p className="text-sm text-white/60">Use another payment method</p>
                      </div>
                    </div>
                  </Label>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {paymentMethod === "external" && (
        <PaymentOptions
          control={control}
          watch={watch}
          setValue={setValue}
          productValue={productValue}
          formatCurrency={formatCurrency}
          calculateFees={calculateFees}
          calculateTotal={calculateTotal}
        />
      )}
    </div>
  )
}

