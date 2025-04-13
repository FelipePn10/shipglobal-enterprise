"use client";

import { useState } from "react";

// Define types inline since components are missing
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveAddress: boolean;
}

export interface PaymentDetails {
  paymentMethod: "credit" | "paypal";
  creditCard: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
    saveCard: boolean;
  };
  paypalEmail: string;
}

const productImages = [
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
  "/placeholder.svg?height=80&width=80",
];

export function useCheckout() {
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
  ]);

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.06;
  const total = subtotal + shipping + tax;

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
  });

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
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const processOrder = async () => {
    setIsProcessing(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const randomOrderNum = Math.floor(100000 + Math.random() * 900000).toString();
        setOrderNumber(randomOrderNum);
        setIsProcessing(false);
        resolve();
      }, 2000);
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setOrderItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: string) => {
    setOrderItems((items) => items.filter((item) => item.id !== id));
  };

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
  };
}