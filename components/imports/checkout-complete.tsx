"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Package, Truck, CheckCircle2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface CheckoutCompleteProps {
  orderItems?: OrderItem[]
  subtotal?: number
  shipping?: number
  tax?: number
  total?: number
}

export function CheckoutComplete({
  orderItems = [
    { name: "Premium Headphones", price: 199.99, quantity: 1 },
    { name: "Wireless Charger", price: 49.99, quantity: 1 },
    { name: "Phone Case", price: 24.99, quantity: 2 },
  ],
  subtotal = 299.97,
  shipping = 9.99,
  tax = 18.0,
  total = 327.96,
}: CheckoutCompleteProps) {
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleComplete = () => {
    setOrderPlaced(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-gray-800 bg-gray-900 shadow-xl">
          <CardHeader className="border-b border-gray-800 pb-6">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-purple-400" />
              Complete Your Order
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Order summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">ORDER SUMMARY</h3>

                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} {item.quantity > 1 && `(${item.quantity})`}
                    </span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-800" />

              {/* Order totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2">
                  <span>Total</span>
                  <span className="text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Order confirmation animation */}
              {orderPlaced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2,
                        }}
                        className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
                      >
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </motion.div>
                    </div>

                    <h3 className="text-center font-bold text-lg mb-3 text-white">Thank you for your order!</h3>

                    <p className="text-center text-sm text-gray-300 mb-4">
                      Your order has been placed and will be processed shortly.
                    </p>

                    <div className="flex justify-between text-xs text-gray-400 bg-gray-800/70 rounded-lg p-3">
                      <div className="flex flex-col items-center">
                        <Package className="h-4 w-4 mb-1 text-purple-400" />
                        <span>Processing</span>
                      </div>
                      <div className="h-0.5 bg-gray-700 flex-1 self-center mx-1"></div>
                      <div className="flex flex-col items-center">
                        <Truck className="h-4 w-4 mb-1 text-gray-500" />
                        <span>Shipping</span>
                      </div>
                      <div className="h-0.5 bg-gray-700 flex-1 self-center mx-1"></div>
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="h-4 w-4 mb-1 text-gray-500" />
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-6">
            <Button
              className="w-full py-6 text-base font-medium"
              onClick={handleComplete}
              disabled={orderPlaced}
            />
          </CardFooter>
        </Card>

        {/* Additional info */}
        {!orderPlaced && (
          <p className="text-center text-xs text-gray-500 mt-4">
            By clicking Complete Payment you agree to our terms and conditions.
          </p>
        )}
      </div>
    </div>
  )
}
