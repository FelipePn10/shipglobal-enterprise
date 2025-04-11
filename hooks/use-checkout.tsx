"use client"

import { OrderItem } from "@/components/imports/checkout/order-summaray"
import { PaymentDetails } from "@/components/imports/checkout/payment-form"
import { ShippingDetails } from "@/components/imports/checkout/shipping-form"
import { useState } from "react"


// Sample product images
const productImages = [
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
]

export function useCheckout() {
  // Sample order items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Premium Headphones",
      price: 199.99,
      quantity: 1,
      image: productImages[0],
    },
    {
      id: "2",
      name: "Wireless Charger",
      price: 49.99,
      quantity: 1,
      image: productImages[1],
    },
    {
      id: "3",
      name: "Phone Case",
      price: 24.99,
      quantity: 2,
      image: productImages[2],
    },
  ])

  // Calculate order totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 9.99
  const tax = subtotal * 0.06 // 6% tax rate
  const total = subtotal + shipping + tax

  // State for shipping and payment details
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    saveAddress: false,
  })

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: "credit",
    creditCard: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    },
    paypalEmail: "",
  })

  // Order processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // Process the order
  const processOrder = async () => {
    setIsProcessing(true)

    // Simulate API call to process payment and create order
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Generate random order number
        const randomOrderNum = Math.floor(100000 + Math.random() * 900000).toString()
        setOrderNumber(randomOrderNum)
        setIsProcessing(false)
        resolve()
      }, 2000)
    })
  }

  // Update item quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    setOrderItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setOrderItems((items) => items.filter((item) => item.id !== id))
  }

  return {
    orderItems,
    subtotal,
    shipping,
    tax,
    total,
    shippingDetails,
    paymentDetails,
    setShippingDetails,
    setPaymentDetails,
    updateItemQuantity,
    removeItem,
    isProcessing,
    processOrder,
    orderNumber,
  }
}
