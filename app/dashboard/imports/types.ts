import { z } from "zod"
import { isCPFValid } from "./data"

// Form schema
export const importFormSchema = z
  .object({
    fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
    cpf: z.string().refine((val) => isCPFValid(val), { message: "Invalid CPF number." }),
    address: z.object({
      street: z.string().min(3, { message: "Street is required" }),
      number: z.string().min(1, { message: "Number is required" }),
      complement: z.string().optional(),
      neighborhood: z.string().min(2, { message: "Neighborhood is required" }),
      city: z.string().min(2, { message: "City is required" }),
      state: z.string().length(2, { message: "State should be 2 characters" }),
      zipCode: z.string().min(8, { message: "ZIP code is required" }),
    }),
    productLink: z.string().url({ message: "Please enter a valid URL." }),
    productValue: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
      message: "Please enter a valid amount greater than 0.",
    }),
    productCategory: z.string({ required_error: "Please select a product category" }),
    originCountry: z.string({ required_error: "Please select the country of origin" }),
    paymentMethod: z.enum(["balance", "external"]),
    externalPaymentMethod: z.enum(["credit", "debit", "paypal", "pix"]).optional(),
    // Credit card fields
    creditCard: z
      .object({
        number: z.string().optional(),
        expiry: z.string().optional(),
        cvc: z.string().optional(),
        name: z.string().optional(),
        saveCard: z.boolean().optional(),
      })
      .optional(),
    // PayPal fields
    paypalEmail: z.string().email({ message: "Please enter a valid email" }).optional(),
    // Terms acceptance
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "external") {
        return !!data.externalPaymentMethod
      }
      return true
    },
    {
      message: "Please select a payment method",
      path: ["externalPaymentMethod"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "external" && data.externalPaymentMethod === "credit") {
        return (
          !!data.creditCard?.number && !!data.creditCard?.expiry && !!data.creditCard?.cvc && !!data.creditCard?.name
        )
      }
      return true
    },
    {
      message: "Please complete all credit card fields",
      path: ["creditCard"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "external" && data.externalPaymentMethod === "paypal") {
        return !!data.paypalEmail
      }
      return true
    },
    {
      message: "Please enter your PayPal email",
      path: ["paypalEmail"],
    },
  )

export type ImportFormValues = z.infer<typeof importFormSchema>

