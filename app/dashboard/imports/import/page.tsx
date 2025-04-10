"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  Package2,
  Check,
  CreditCard,
  Globe,
  Info,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  User,
  MapPin,
  DollarSign,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoForm } from "@/components/imports/personal-info-form"
import { ProductInfoForm } from "@/components/imports/product-info-form"
import { TermsCheckbox } from "@/components/imports/terms-checkbox"
import { ShippingAddressForm } from "@/components/imports/shipping-addres-form"
import { PaymentMethodSelector } from "@/components/imports/payment-method-selector"
import { popularCountries, productCategories } from "@/data/data"
import { type ImportFormValues, importFormSchema } from "@/types/types"

export default function ImportPage() {
  const [step, setStep] = useState<"details" | "address" | "product" | "payment" | "review" | "confirmation">("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(20)
  const { data: session } = useSession()
  const router = useRouter()

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      },
      productLink: "",
      productValue: "",
      productCategory: "",
      originCountry: "",
      paymentMethod: "balance",
      externalPaymentMethod: "credit",
      acceptTerms: false,
      creditCard: {
        number: "",
        expiry: "",
        cvc: "",
        name: "",
        saveCard: false,
      },
      paypalEmail: "",
    },
    mode: "onChange", // This will validate on change, giving users immediate feedback
  })

  const paymentMethod = form.watch("paymentMethod")
  const externalPaymentMethod = form.watch("externalPaymentMethod")
  const productValue = form.watch("productValue")
  const originCountry = form.watch("originCountry")
  const productCategory = form.watch("productCategory")

  useEffect(() => {
    if (paymentMethod === "external" && !externalPaymentMethod) {
      form.setValue("externalPaymentMethod", "credit")
    }
  }, [paymentMethod, externalPaymentMethod, form])

  useEffect(() => {
    switch (step) {
      case "details":
        setProgressPercentage(20)
        break
      case "address":
        setProgressPercentage(40)
        break
      case "product":
        setProgressPercentage(60)
        break
      case "payment":
        setProgressPercentage(80)
        break
      case "review":
        setProgressPercentage(90)
        break
      case "confirmation":
        setProgressPercentage(100)
        break
    }
  }, [step])

  // Direct navigation functions to ensure the Continue button works properly
  const handleNextStep = () => {
    const currentStepOrder = ["details", "address", "product", "payment", "review", "confirmation"]
    const currentIndex = currentStepOrder.indexOf(step)
    if (currentIndex < currentStepOrder.length - 1) {
      setStep(currentStepOrder[currentIndex + 1] as any)
    }
  }

  const handlePreviousStep = () => {
    const currentStepOrder = ["details", "address", "product", "payment", "review", "confirmation"]
    const currentIndex = currentStepOrder.indexOf(step)
    if (currentIndex > 0) {
      setStep(currentStepOrder[currentIndex - 1] as any)
    }
  }

  // Validate current step before proceeding
  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = []

    switch (step) {
      case "details":
        fieldsToValidate = ["fullName", "cpf"]
        break
      case "address":
        fieldsToValidate = ["address.street", "address.number", "address.city", "address.state", "address.zipCode"]
        break
      case "product":
        fieldsToValidate = ["productCategory", "originCountry", "productValue"]
        break
      case "payment":
        fieldsToValidate = ["paymentMethod"]
        if (paymentMethod === "external") {
          fieldsToValidate.push("externalPaymentMethod")
          if (externalPaymentMethod === "credit" || externalPaymentMethod === "debit") {
            fieldsToValidate.push("creditCard.number", "creditCard.expiry", "creditCard.cvc", "creditCard.name")
          } else if (externalPaymentMethod === "paypal") {
            fieldsToValidate.push("paypalEmail")
          }
        }
        break
      case "review":
        fieldsToValidate = ["acceptTerms"]
        break
    }

    const result = await form.trigger(fieldsToValidate as any)
    return result
  }

  const onSubmit = async (data: ImportFormValues) => {
    const effectiveSession =
      process.env.NODE_ENV === "development" && !session?.user ? { user: { id: "1", type: "user" } } : session

    if (!effectiveSession?.user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to create an import",
        variant: "destructive",
      })
      return
    }

    if (step === "review") {
      if (!data.acceptTerms) {
        form.setError("acceptTerms", {
          type: "required",
          message: "You must accept the terms to proceed",
        })
        toast({
          title: "Error",
          description: "You must accept the terms to proceed",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      try {
        const headers = {
          "Content-Type": "application/json",
          ...(effectiveSession.user.type === "company"
            ? { "company-id": effectiveSession.user.id }
            : { "user-id": effectiveSession.user.id }),
        }

        const importData = {
          title: `Import of ${getCategoryName(data.productCategory)}`,
          origin: data.originCountry,
          destination: `${data.address.city}, ${data.address.state}`,
          status: "processing",
          progress: 0,
        }

        const response = await fetch("/api/imports", {
          method: "POST",
          headers,
          body: JSON.stringify(importData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create import")
        }

        const newImport = await response.json()
        setIsSubmitting(false)
        setStep("confirmation")
        toast({
          title: "Success",
          description: "Your import was created successfully!",
          variant: "default",
        })
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: "Error creating import",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        })
      }
    } else if (step === "confirmation") {
      router.push("/dashboard/imports")
    } else {
      // For all other steps, just validate and proceed
      const isValid = await validateCurrentStep()
      if (isValid) {
        handleNextStep()
      } else {
        toast({
          title: "Please check your information",
          description: "Some required fields need to be completed correctly.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle continue button click separately from form submission
  const handleContinueClick = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      handleNextStep()
    } else {
      toast({
        title: "Please check your information",
        description: "Some required fields need to be completed correctly.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numValue)
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14)
  }

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9)
  }

  const getCountryFlag = (countryCode: string) => {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`
  }

  const getCountryName = (countryCode: string) => {
    const country = popularCountries.find((c: { value: string; label: string }) => c.value === countryCode)
    return country ? country.label : countryCode
  }

  const getCategoryName = (categoryCode: string) => {
    const category = productCategories.find((c: { value: string; label: string }) => c.value === categoryCode)
    return category ? category.label : categoryCode
  }

  const calculateFees = (amount: string, method: string) => {
    const value = Number.parseFloat(amount || "0")
    switch (method) {
      case "credit":
        return value * 0.02 // 2% fee
      case "debit":
        return value * 0.01 // 1% fee
      case "paypal":
        return value * 0.025 // 2.5% fee
      case "pix":
        return 0 // No fee
      default:
        return 0
    }
  }

  const calculateTotal = (amount: string, method: string) => {
    const value = Number.parseFloat(amount || "0")
    const fee = calculateFees(amount, method)
    return value + fee
  }

  const renderStepIndicator = () => {
    const steps = [
      { key: "details", label: "Personal Info", icon: <User className="h-5 w-5" /> },
      { key: "address", label: "Shipping", icon: <MapPin className="h-5 w-5" /> },
      { key: "product", label: "Product", icon: <Package2 className="h-5 w-5" /> },
      { key: "payment", label: "Payment", icon: <DollarSign className="h-5 w-5" /> },
      { key: "review", label: "Review", icon: <Info className="h-5 w-5" /> },
    ]

    return (
      <div className="relative mb-10 px-6 md:px-12">
        {/* Progress bar underneath */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-800 mx-6 md:mx-12 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between relative z-10">
          {steps.map((s, index) => {
            const isActive = step === s.key
            const isPast = steps.findIndex((x) => x.key === step) > index
            const isFuture = steps.findIndex((x) => x.key === step) < index

            return (
              <div
                key={s.key}
                className={cn(
                  "flex flex-col items-center space-y-3",
                  isActive ? "text-white" : "",
                  isPast ? "text-purple-400" : "",
                  isFuture ? "text-gray-500" : "",
                )}
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/20 scale-110"
                      : "",
                    isPast ? "bg-purple-500 text-white" : "",
                    isFuture ? "bg-gray-800 text-gray-400" : "",
                  )}
                >
                  {isPast ? <Check className="h-5 w-5" /> : s.icon}
                </div>
                <span className="text-xs font-medium hidden md:block">{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderSidebar = () => {
    if (step === "confirmation") return null

    return (
      <div className="hidden lg:block w-96 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800/50 overflow-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-900 to-gray-900/95 backdrop-blur-sm p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Import Assistant</h2>
          </div>
          <p className="text-gray-400 text-sm">Complete your import request in a few simple steps</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-white">
                  {step === "details"
                    ? "1"
                    : step === "address"
                      ? "2"
                      : step === "product"
                        ? "3"
                        : step === "payment"
                          ? "4"
                          : "5"}
                </span>
              </div>
              {step === "details" && "Personal Information"}
              {step === "address" && "Shipping Address"}
              {step === "product" && "Product Details"}
              {step === "payment" && "Payment Method"}
              {step === "review" && "Final Review"}
            </h3>

            <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
              {step === "details" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Please provide your personal information for customs documentation. Make sure it matches your
                    official ID.
                  </p>

                  <div className="flex items-start space-x-3 bg-gray-800/50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Important</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Your CPF number is required for all international imports to Brazil and must match the
                        recipient's identification.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === "address" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Enter the address where you want your imported items to be delivered.
                  </p>

                  <div className="flex items-start space-x-3 bg-gray-800/50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Delivery Information</p>
                      <p className="text-xs text-gray-400 mt-1">
                        For apartment buildings, include your unit number in the complement field to ensure accurate
                        delivery.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === "product" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Provide details about the product you want to import. The category affects import taxes and
                    regulations.
                  </p>

                  {originCountry && (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        {originCountry && (
                          <img
                            src={getCountryFlag(originCountry) || "/placeholder.svg"}
                            alt={getCountryName(originCountry)}
                            className="h-5 mr-2"
                          />
                        )}
                        <h4 className="font-medium">{getCountryName(originCountry)}</h4>
                      </div>

                      <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Shipping time:</span>
                          <span className="text-white">14-21 days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Import tax:</span>
                          <span className="text-white">~18% of value</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Customs clearance:</span>
                          <span className="text-white">3-5 days</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Choose how you would like to pay for your import. Different methods have different processing fees.
                  </p>

                  {productValue && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Cost Breakdown</h4>
                      <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Product Value:</span>
                          <span className="text-white">{formatCurrency(productValue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Service Fee (5%):</span>
                          <span className="text-white">
                            {formatCurrency((Number.parseFloat(productValue || "0") * 0.05).toString())}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Payment Fee:</span>
                          <span className="text-white">
                            {formatCurrency(calculateFees(productValue || "0", externalPaymentMethod || "").toString())}
                          </span>
                        </div>
                        <Separator className="my-2 bg-gray-700" />
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total:</span>
                          <span className="text-gradient bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                            {formatCurrency(
                              (calculateTotal(productValue || "0", externalPaymentMethod || "") * 1.05).toString(),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === "review" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">
                    Please review all your information before completing your import request.
                  </p>

                  <div className="flex items-start space-x-3 bg-gray-800/50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Final Review</p>
                      <p className="text-xs text-gray-400 mt-1">
                        After submission, changing details may require contacting customer support.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center mr-3">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="font-medium">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Our support team is available 24/7 to assist you with any questions about your import.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-white"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPageContent = () => {
    return (
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-800/50 px-6 py-4 flex items-center bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {step === "confirmation" ? "Import Complete" : "Create New Import"}
            </h1>
          </div>

          {step !== "confirmation" && (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-medium text-gray-400">Completion: {progressPercentage}%</span>
              <div className="w-32">
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-gray-800"
                  indicatorClassName="bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
              {step !== "confirmation" && renderStepIndicator()}

              <ScrollArea className="flex-1 px-6 md:px-12">
                {step === "details" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
                      <p className="text-gray-400 text-sm">Fill in your personal details for import documents</p>
                    </div>

                    <Card className="border-gray-800/50 bg-gray-900/50 shadow-lg">
                      <CardContent className="pt-6">
                        <PersonalInfoForm control={form.control} formatCPF={formatCPF} />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {step === "address" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Shipping Address</h2>
                      <p className="text-gray-400 text-sm">Where should we deliver your import?</p>
                    </div>

                    <Card className="border-gray-800/50 bg-gray-900/50 shadow-lg">
                      <CardContent className="pt-6">
                        <ShippingAddressForm control={form.control} formatZipCode={formatZipCode} />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {step === "product" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Product Information</h2>
                      <p className="text-gray-400 text-sm">Tell us about the item you're importing</p>
                    </div>

                    <Card className="border-gray-800/50 bg-gray-900/50 shadow-lg">
                      <CardContent className="pt-6">
                        <ProductInfoForm control={form.control} getCountryFlag={getCountryFlag} />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {step === "payment" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
                      <p className="text-gray-400 text-sm">Select how you'd like to pay for your import</p>
                    </div>

                    <Card className="border-gray-800/50 bg-gray-900/50 shadow-lg">
                      <CardContent className="pt-6">
                        <PaymentMethodSelector
                          control={form.control}
                          watch={form.watch}
                          setValue={form.setValue}
                          formatCurrency={formatCurrency}
                          calculateFees={calculateFees}
                          calculateTotal={calculateTotal}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {step === "review" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Review Your Import</h2>
                      <p className="text-gray-400 text-sm">Please check all details before finalizing</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-gray-800/50 bg-gray-900/50 shadow-lg">
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <User className="h-4 w-4 mr-2 text-cyan-400" />
                            Personal Information
                          </h3>
                          <dl className="space-y-3">
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Name:</dt>
                              <dd className="font-medium">{form.getValues("fullName") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">CPF:</dt>
                              <dd className="font-medium">{form.getValues("cpf") || "Not provided"}</dd>
                            </div>
                          </dl>

                          <h3 className="text-lg font-medium mt-6 mb-4 flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-cyan-400" />
                            Shipping Address
                          </h3>
                          <dl className="space-y-3">
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Street:</dt>
                              <dd className="font-medium">{form.getValues("address.street") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Number:</dt>
                              <dd className="font-medium">{form.getValues("address.number") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">City:</dt>
                              <dd className="font-medium">{form.getValues("address.city") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">State:</dt>
                              <dd className="font-medium">{form.getValues("address.state") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">ZIP Code:</dt>
                              <dd className="font-medium">{form.getValues("address.zipCode") || "Not provided"}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-800/50 bg-gray-900/50 shadow-lg">
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Package2 className="h-4 w-4 mr-2 text-cyan-400" />
                            Product Details
                          </h3>
                          <dl className="space-y-3">
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Category:</dt>
                              <dd className="font-medium">
                                {getCategoryName(form.getValues("productCategory")) || "Not selected"}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Origin:</dt>
                              <dd className="flex items-center font-medium">
                                {form.getValues("originCountry") && (
                                  <img
                                    src={getCountryFlag(form.getValues("originCountry")) || "/placeholder.svg"}
                                    alt={getCountryName(form.getValues("originCountry"))}
                                    className="h-4 mr-2"
                                  />
                                )}
                                {getCountryName(form.getValues("originCountry")) || "Not selected"}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Value:</dt>
                              <dd className="font-medium">
                                {formatCurrency(form.getValues("productValue")) || "Not provided"}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Product Link:</dt>
                              <dd className="truncate max-w-[200px] font-medium">
                                {form.getValues("productLink") || "Not provided"}
                              </dd>
                            </div>
                          </dl>

                          <h3 className="text-lg font-medium mt-6 mb-4 flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-cyan-400" />
                            Payment Information
                          </h3>
                          <dl className="space-y-3">
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Method:</dt>
                              <dd className="capitalize font-medium">
                                {form.getValues("paymentMethod") === "balance"
                                  ? "Account Balance"
                                  : form.getValues("externalPaymentMethod")}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Subtotal:</dt>
                              <dd className="font-medium">{formatCurrency(form.getValues("productValue"))}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Service Fee (5%):</dt>
                              <dd className="font-medium">
                                {formatCurrency(
                                  (Number.parseFloat(form.getValues("productValue") || "0") * 0.05).toString(),
                                )}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-400">Payment Fee:</dt>
                              <dd className="font-medium">
                                {formatCurrency(
                                  calculateFees(
                                    form.getValues("productValue") || "0",
                                    form.getValues("externalPaymentMethod") || "",
                                  ).toString(),
                                )}
                              </dd>
                            </div>
                            <Separator className="my-2 bg-gray-700" />
                            <div className="flex justify-between font-medium">
                              <dt>Total:</dt>
                              <dd className="text-gradient bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent text-lg">
                                {formatCurrency(
                                  (
                                    calculateTotal(
                                      form.getValues("productValue") || "0",
                                      form.getValues("externalPaymentMethod") || "balance",
                                    ) * 1.05
                                  ).toString(),
                                )}
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="border-gray-800/50 bg-gray-900/50 shadow-lg">
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Info className="h-4 w-4 mr-2 text-cyan-400" />
                          Terms & Conditions
                        </h3>
                        <TermsCheckbox control={form.control} />

                        <Alert className="mt-4 bg-amber-900/20 border-amber-500/30">
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                          <AlertTitle>Important Notice</AlertTitle>
                          <AlertDescription className="text-sm text-gray-300">
                            By proceeding, you confirm all information is accurate and agree to our import terms and
                            conditions.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {step === "confirmation" && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto text-center animate-fadeIn">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                      <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold mb-3">Import Successfully Created!</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                      Your import request has been registered and is now being processed. You can track its progress in
                      your dashboard.
                    </p>

                    <div className="w-full max-w-md bg-gray-900/50 border border-gray-800/50 rounded-lg p-6 mb-8 shadow-lg">
                      <h3 className="font-medium mb-4 flex items-center">
                        <Package2 className="h-4 w-4 mr-2 text-cyan-400" />
                        Import Summary
                      </h3>

                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Import ID:</span>
                        <span className="font-mono bg-gray-800 px-2 py-0.5 rounded text-cyan-400">
                          #IMP{Math.floor(100000 + Math.random() * 900000)}
                        </span>
                      </div>

                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Product:</span>
                        <span>{getCategoryName(form.getValues("productCategory"))}</span>
                      </div>

                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Origin:</span>
                        <span className="flex items-center">
                          {form.getValues("originCountry") && (
                            <img
                              src={getCountryFlag(form.getValues("originCountry")) || "/placeholder.svg"}
                              alt={getCountryName(form.getValues("originCountry"))}
                              className="h-4 mr-2"
                            />
                          )}
                          {getCountryName(form.getValues("originCountry"))}
                        </span>
                      </div>

                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Total Value:</span>
                        <span className="text-gradient bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent font-medium">
                          {formatCurrency(
                            (
                              calculateTotal(
                                form.getValues("productValue") || "0",
                                form.getValues("externalPaymentMethod") || "balance",
                              ) * 1.05
                            ).toString(),
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30">Processing</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                      <Button
                        variant="outline"
                        className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-white"
                        onClick={() => router.push("/dashboard")}
                      >
                        Go to Dashboard
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                        onClick={() => router.push("/dashboard/imports")}
                      >
                        View My Imports
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {step !== "confirmation" && (
                <div className="p-6 border-t border-gray-800/50 flex items-center justify-between bg-gray-900/80 backdrop-blur-sm">
                  {step !== "details" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}

                  <Button
                    type="button"
                    className={cn(
                      "ml-auto bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20 transition-all duration-300",
                      isSubmitting && "opacity-70 cursor-not-allowed",
                    )}
                    disabled={isSubmitting}
                    onClick={step === "review" ? form.handleSubmit(onSubmit) : handleContinueClick}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {step === "review" ? "Complete Import" : "Continue"}
                    {step !== "review" && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto">
        <div className="flex min-h-screen">
          {renderSidebar()}
          {renderPageContent()}
        </div>
      </div>
    </div>
  )
}
