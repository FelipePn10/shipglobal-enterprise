"use client"
import { motion } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreditCard, Wallet, Landmark, Bitcoin } from "lucide-react"

interface PaymentMethodProps {
  selected: string
  onSelect: (method: string) => void
}

export function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Payment Method</h3>
      <RadioGroup value={selected} onValueChange={onSelect} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <CreditCard className="mb-3 h-6 w-6" />
            Credit Card
          </Label>
        </div>

        <div>
          <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
          <Label
            htmlFor="paypal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Wallet className="mb-3 h-6 w-6" />
            PayPal
          </Label>
        </div>

        <div>
          <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
          <Label
            htmlFor="bank"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Landmark className="mb-3 h-6 w-6" />
            Bank Transfer
          </Label>
        </div>

        <div>
          <RadioGroupItem value="crypto" id="crypto" className="peer sr-only" />
          <Label
            htmlFor="crypto"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Bitcoin className="mb-3 h-6 w-6" />
            Cryptocurrency
          </Label>
        </div>
      </RadioGroup>

      {selected === "card" && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 pt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
        </motion.div>
      )}

      {selected === "paypal" && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="paypalEmail">PayPal Email</Label>
            <Input id="paypalEmail" type="email" placeholder="your@email.com" />
          </div>
        </motion.div>
      )}

      {selected === "bank" && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input id="accountName" placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" placeholder="123456789" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input id="routingNumber" placeholder="987654321" />
            </div>
          </div>
        </motion.div>
      )}

      {selected === "crypto" && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 pt-4"
        >
          <div className="p-4 bg-muted rounded-md flex items-center justify-center">
            <p className="text-center text-sm">Scan the QR code or copy the wallet address to complete your payment</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-md">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <div className="flex">
              <Input id="walletAddress" value="0x1a2b3c4d5e6f7g8h9i0j" readOnly className="rounded-r-none" />
              <Button variant="secondary" className="rounded-l-none">
                Copy
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Import Button component for the Copy button
import { Button } from "@/components/ui/button"

