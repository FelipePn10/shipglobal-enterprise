"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  ArrowLeft, 
  ChevronRight, 
  Loader2, 
  Package2, 
  Truck, 
  Check, 
  CreditCard, 
  FileCheck, 
  Globe, 
  Info, 
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { PersonalInfoForm } from "@/components/imports/personal-info-form";
import { ProductInfoForm } from "@/components/imports/product-info-form";
import { TermsCheckbox } from "@/components/imports/terms-checkbox";
import { ShippingAddressForm } from "@/components/imports/shipping-addres-form";
import { PaymentMethodSelector } from "@/components/imports/payment-method-selector";
import { popularCountries, productCategories } from "@/data/data";
import { ImportFormValues, importFormSchema } from "@/types/types";

export default function ImportPage() {
  const [step, setStep] = useState<"details" | "address" | "product" | "payment" | "review" | "confirmation">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(20);
  const { data: session } = useSession();
  const router = useRouter();

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
  });

  const paymentMethod = form.watch("paymentMethod");
  const externalPaymentMethod = form.watch("externalPaymentMethod");
  const productValue = form.watch("productValue");
  const originCountry = form.watch("originCountry");
  const productCategory = form.watch("productCategory");

  useEffect(() => {
    if (paymentMethod === "external" && !externalPaymentMethod) {
      form.setValue("externalPaymentMethod", "credit");
    }
  }, [paymentMethod, externalPaymentMethod, form]);

  useEffect(() => {
    switch (step) {
      case "details":
        setProgressPercentage(20);
        break;
      case "address":
        setProgressPercentage(40);
        break;
      case "product":
        setProgressPercentage(60);
        break;
      case "payment":
        setProgressPercentage(80);
        break;
      case "review":
        setProgressPercentage(90);
        break;
      case "confirmation":
        setProgressPercentage(100);
        break;
    }
  }, [step]);

  const handleNextStep = () => {
    const currentStepOrder = ["details", "address", "product", "payment", "review", "confirmation"];
    const currentIndex = currentStepOrder.indexOf(step);
    if (currentIndex < currentStepOrder.length - 1) {
      setStep(currentStepOrder[currentIndex + 1] as any);
    }
  };

  const handlePreviousStep = () => {
    const currentStepOrder = ["details", "address", "product", "payment", "review", "confirmation"];
    const currentIndex = currentStepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(currentStepOrder[currentIndex - 1] as any);
    }
  };

  const onSubmit = async (data: ImportFormValues) => {
    const effectiveSession = process.env.NODE_ENV === "development" && !session?.user
      ? { user: { id: "1", type: "user" } }
      : session;

    if (!effectiveSession?.user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to create an import",
        variant: "destructive",
      });
      return;
    }

    if (step === "details") {
      setStep("address");
      return;
    }

    if (step === "address") {
      setStep("product");
      return;
    }

    if (step === "product") {
      setStep("payment");
      return;
    }

    if (step === "payment") {
      if (data.paymentMethod === "external") {
        if (!data.externalPaymentMethod) {
          form.setError("externalPaymentMethod", {
            type: "required",
            message: "Please select a payment method",
          });
          toast({
            title: "Error",
            description: "Please select a payment method",
            variant: "destructive",
          });
          return;
        }

        if (data.externalPaymentMethod === "credit" || data.externalPaymentMethod === "debit") {
          if (!data.creditCard?.number || !data.creditCard?.expiry || !data.creditCard?.cvc || !data.creditCard?.name) {
            form.setError("creditCard", {
              type: "required",
              message: "Please complete all card details",
            });
            toast({
              title: "Error",
              description: "Please complete all card details",
              variant: "destructive",
            });
            return;
          }
        } else if (data.externalPaymentMethod === "paypal" && !data.paypalEmail) {
          form.setError("paypalEmail", {
            type: "required",
            message: "Please enter your PayPal email",
          });
          toast({
            title: "Error",
            description: "Please enter your PayPal email",
            variant: "destructive",
          });
          return;
        }
      }

      setStep("review");
      return;
    }

    if (step === "review") {
      if (!data.acceptTerms) {
        form.setError("acceptTerms", {
          type: "required",
          message: "You must accept the terms to proceed",
        });
        toast({
          title: "Error",
          description: "You must accept the terms to proceed",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const headers = {
          "Content-Type": "application/json",
          ...(effectiveSession.user.type === "company"
            ? { "company-id": effectiveSession.user.id }
            : { "user-id": effectiveSession.user.id }
          ),
        };

        const importData = {
          title: `Import of ${getCategoryName(data.productCategory)}`,
          origin: data.originCountry,
          destination: `${data.address.city}, ${data.address.state}`,
          status: "processing",
          progress: 0,
        };

        const response = await fetch("/api/imports", {
          method: "POST",
          headers,
          body: JSON.stringify(importData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create import");
        }

        const newImport = await response.json();
        setIsSubmitting(false);
        setStep("confirmation");
        toast({
          title: "Success",
          description: "Your import was created successfully!",
        });
      } catch (error) {
        setIsSubmitting(false);
        toast({
          title: "Error creating import",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    }

    if (step === "confirmation") {
      router.push("/dashboard/imports");
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = Number.parseFloat(value);
    if (isNaN(numValue)) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numValue);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14);
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  const getCountryFlag = (countryCode: string) => {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  const getCountryName = (countryCode: string) => {
    const country = popularCountries.find((c: { value: string; label: string }) => c.value === countryCode);
    return country ? country.label : countryCode;
  };

  const getCategoryName = (categoryCode: string) => {
    const category = productCategories.find((c: { value: string; label: string }) => c.value === categoryCode);
    return category ? category.label : categoryCode;
  };

  const calculateFees = (amount: string, method: string) => {
    const value = Number.parseFloat(amount || "0");
    switch (method) {
      case "credit":
        return value * 0.02; // 2% fee
      case "debit":
        return value * 0.01; // 1% fee
      case "paypal":
        return value * 0.025; // 2.5% fee
      case "pix":
        return 0; // No fee
      default:
        return 0;
    }
  };

  const calculateTotal = (amount: string, method: string) => {
    const value = Number.parseFloat(amount || "0");
    const fee = calculateFees(amount, method);
    return value + fee;
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "details", label: "Personal Info", icon: <FileCheck className="h-5 w-5" /> },
      { key: "address", label: "Shipping", icon: <Truck className="h-5 w-5" /> },
      { key: "product", label: "Product", icon: <Package2 className="h-5 w-5" /> },
      { key: "payment", label: "Payment", icon: <CreditCard className="h-5 w-5" /> },
      { key: "review", label: "Review", icon: <Info className="h-5 w-5" /> },
    ];

    return (
      <div className="flex justify-between mb-8 px-6 md:px-12">
        {steps.map((s, index) => {
          const isActive = step === s.key;
          const isPast = steps.findIndex(x => x.key === step) > index;
          const isFuture = steps.findIndex(x => x.key === step) < index;

          return (
            <div 
              key={s.key} 
              className={cn(
                "flex flex-col items-center space-y-2 relative",
                isActive ? "text-indigo-400" : "",
                isPast ? "text-green-400" : "",
                isFuture ? "text-gray-500" : ""
              )}
            >
              <div 
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  isActive ? "bg-indigo-500 text-white" : "",
                  isPast ? "bg-green-500 text-white" : "",
                  isFuture ? "bg-gray-700 text-gray-400" : ""
                )}
              >
                {isPast ? <Check className="h-5 w-5" /> : s.icon}
              </div>
              <span className="text-xs font-medium hidden md:block">{s.label}</span>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute h-0.5 w-[calc(100%-2rem)] left-1/2 top-5",
                    isPast ? "bg-green-500" : "bg-gray-700"
                  )}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSidebar = () => {
    if (step === "confirmation") return null;

    return (
      <div className="hidden lg:block w-80 bg-black/90 border-r border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Import Assistant</h2>
          <p className="text-white/60 text-sm">We're here to help you through the import process</p>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2 text-indigo-400" />
            Tips for this step
          </h3>
          
          {step === "details" && (
            <div className="space-y-4">
              <p className="text-sm text-white/80">Make sure your personal information matches your official documents to avoid delays.</p>
              
              <Alert className="bg-indigo-900/20 border-indigo-500/50">
                <AlertCircle className="h-4 w-4 text-indigo-400" />
                <AlertTitle>Personal Information</AlertTitle>
                <AlertDescription className="text-xs">
                  This information will be used for customs declaration forms.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {step === "address" && (
            <div className="space-y-4">
              <p className="text-sm text-white/80">Enter the address where you want your imported items to be delivered.</p>
              
              <Alert className="bg-indigo-900/20 border-indigo-500/50">
                <AlertCircle className="h-4 w-4 text-indigo-400" />
                <AlertTitle>Shipping Address</AlertTitle>
                <AlertDescription className="text-xs">
                  We'll use this address for all shipping documents and delivery.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {step === "product" && (
            <div className="space-y-4">
              <p className="text-sm text-white/80">Provide details about the product you want to import.</p>
              
              <Alert className="bg-indigo-900/20 border-indigo-500/50">
                <AlertCircle className="h-4 w-4 text-indigo-400" />
                <AlertTitle>Product Details</AlertTitle>
                <AlertDescription className="text-xs">
                  The product category affects import taxes and regulations.
                </AlertDescription>
              </Alert>
              
              {originCountry && (
                <div className="p-4 bg-white/5 rounded-lg mt-6">
                  <div className="flex items-center mb-2">
                    {originCountry && (
                      <img 
                        src={getCountryFlag(originCountry)} 
                        alt={getCountryName(originCountry)} 
                        className="h-4 mr-2"
                      />
                    )}
                    <h4 className="font-medium">{getCountryName(originCountry)}</h4>
                  </div>
                  <p className="text-xs text-white/70">
                    Estimated shipping time: 14-21 days
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    Import tax: Approximately 18% of product value
                  </p>
                </div>
              )}
            </div>
          )}
          
          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-sm text-white/80">Choose how you would like to pay for your import.</p>
              
              <Alert className="bg-indigo-900/20 border-indigo-500/50">
                <AlertCircle className="h-4 w-4 text-indigo-400" />
                <AlertTitle>Payment Options</AlertTitle>
                <AlertDescription className="text-xs">
                  Some payment methods may include additional processing fees.
                </AlertDescription>
              </Alert>
              
              {productValue && (
                <div className="p-4 bg-white/5 rounded-lg mt-6">
                  <h4 className="font-medium mb-2">Cost Breakdown</h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Product Value:</span>
                    <span>{formatCurrency(productValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Service Fee:</span>
                    <span>{formatCurrency((Number.parseFloat(productValue || "0") * 0.05).toString())}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Payment Fee:</span>
                    <span>{formatCurrency(calculateFees(productValue || "0", externalPaymentMethod || "").toString())}</span>
                  </div>
                  <Separator className="my-2 bg-white/10" />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency((calculateTotal(productValue || "0", externalPaymentMethod || "") * 1.05).toString())}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {step === "review" && (
            <div className="space-y-4">
              <p className="text-sm text-white/80">Please review all your information before completing your import request.</p>
              
              <Alert className="bg-indigo-900/20 border-indigo-500/50">
                <AlertCircle className="h-4 w-4 text-indigo-400" />
                <AlertTitle>Final Review</AlertTitle>
                <AlertDescription className="text-xs">
                  After submission, changing details may require contacting customer support.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg border border-white/10">
          <h4 className="font-medium mb-2 flex items-center">
            <Globe className="h-4 w-4 mr-2 text-indigo-400" />
            Need Help?
          </h4>
          <p className="text-sm text-white/80 mb-4">Our support team is here to assist you with any questions.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/20 bg-black/50 hover:bg-white/10"
          >
            Contact Support
          </Button>
        </div>
      </div>
    );
  };

  const renderPageContent = () => {
    return (
      <div className="flex-1 flex flex-col">
        <div className="border-b border-white/10 px-6 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4 text-white/80 hover:text-white hover:bg-white/5"
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
              <span className="text-sm font-medium text-white/60">
                Completion: {progressPercentage}%
              </span>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2 bg-white/10" />
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
                  <div className="space-y-6 max-w-2xl mx-auto py-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
                      <p className="text-white/60 text-sm">Fill in your personal details for import documents</p>
                    </div>
                    
                    <Card className="border-white/10 bg-white/5 shadow-md">
                      <CardContent className="pt-6">
                        <PersonalInfoForm control={form.control} formatCPF={formatCPF} />
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {step === "address" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Shipping Address</h2>
                      <p className="text-white/60 text-sm">Where should we deliver your import?</p>
                    </div>
                    
                    <Card className="border-white/10 bg-white/5 shadow-md">
                      <CardContent className="pt-6">
                        <ShippingAddressForm control={form.control} formatZipCode={formatZipCode} />
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {step === "product" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Product Information</h2>
                      <p className="text-white/60 text-sm">Tell us about the item you're importing</p>
                    </div>
                    
                    <Card className="border-white/10 bg-white/5 shadow-md">
                      <CardContent className="pt-6">
                        <ProductInfoForm control={form.control} getCountryFlag={getCountryFlag} />
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {step === "payment" && (
                  <div className="space-y-6 max-w-2xl mx-auto py-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Payment Method</h2>
                      <p className="text-white/60 text-sm">Select how you'd like to pay for your import</p>
                    </div>
                    
                    <Card className="border-white/10 bg-white/5 shadow-md">
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
                  <div className="space-y-6 max-w-2xl mx-auto py-8">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Review Your Import</h2>
                      <p className="text-white/60 text-sm">Please check all details before finalizing</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-white/10 bg-white/5 shadow-md">
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-white/60">Name:</dt>
                              <dd>{form.getValues("fullName") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">CPF:</dt>
                              <dd>{form.getValues("cpf") || "Not provided"}</dd>
                            </div>
                          </dl>
                          
                          <h3 className="text-lg font-medium mt-6 mb-4">Shipping Address</h3>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-white/60">Street:</dt>
                              <dd>{form.getValues("address.street") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">Number:</dt>
                              <dd>{form.getValues("address.number") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">City:</dt>
                              <dd>{form.getValues("address.city") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">State:</dt>
                              <dd>{form.getValues("address.state") || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">ZIP Code:</dt>
                              <dd>{form.getValues("address.zipCode") || "Not provided"}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-white/10 bg-white/5 shadow-md">
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-medium mb-4">Product Details</h3>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-white/60">Category:</dt>
                              <dd>{getCategoryName(form.getValues("productCategory")) || "Not selected"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">Origin:</dt>
                              <dd className="flex items-center">
                                {form.getValues("originCountry") && (
                                  <img 
                                    src={getCountryFlag(form.getValues("originCountry"))} 
                                    alt={getCountryName(form.getValues("originCountry"))} 
                                    className="h-4 mr-2"
                                  />
                                )}
                                {getCountryName(form.getValues("originCountry")) || "Not selected"}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">Value:</dt>
                              <dd>{formatCurrency(form.getValues("productValue")) || "Not provided"}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">Product Link:</dt>
                              <dd className="truncate max-w-[200px]">
                                {form.getValues("productLink") || "Not provided"}
                              </dd>
                            </div>
                          </dl>
                          
                          <h3 className="text-lg font-medium mt-6 mb-4">Payment Information</h3>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-white/60">Method:</dt>
                              <dd className="capitalize">
                                {form.getValues("paymentMethod") === "balance" 
                                  ? "Account Balance" 
                                  : form.getValues("externalPaymentMethod")}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">Subtotal:</dt>
                              <dd>{formatCurrency(form.getValues("productValue"))}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">Service Fee (5%):</dt>
                              <dd>{formatCurrency((Number.parseFloat(form.getValues("productValue") || "0") * 0.05).toString())}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-white/60">Payment Fee:</dt>
                              <dd>{formatCurrency(calculateFees(form.getValues("productValue") || "0", form.getValues("externalPaymentMethod") || "").toString())}</dd>
                            </div>
                            <Separator className="my-2 bg-white/10" />
                            <div className="flex justify-between font-medium">
                              <dt>Total:</dt>
                              <dd>{formatCurrency((calculateTotal(form.getValues("productValue") || "0", form.getValues("externalPaymentMethod") || "balance") * 1.05).toString())}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="border-white/10 bg-white/5 shadow-md">
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4">Terms & Conditions</h3>
                        <TermsCheckbox control={form.control} />
                        
                        <Alert className="mt-4 bg-amber-900/20 border-amber-500/50">
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                          <AlertTitle>Important Notice</AlertTitle>
                          <AlertDescription className="text-sm">
                            By proceeding, you confirm all information is accurate and agree to our import terms and conditions.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {step === "confirmation" && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto text-center">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6">
                      <Check className="h-12 w-12 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">Import Successfully Created!</h2>
                    <p className="text-white/70 mb-8 max-w-md">
                      Your import request has been registered and is now being processed. You can track its progress in your dashboard.
                    </p>
                    
                    <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                      <h3 className="font-medium mb-4">Import Summary</h3>
                      
                      <div className="flex justify-between mb-3">
                        <span className="text-white/70">Import ID:</span>
                        <span className="font-mono">#IMP{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                      
                      <div className="flex justify-between mb-3">
                        <span className="text-white/70">Product:</span>
                        <span>{getCategoryName(form.getValues("productCategory"))}</span>
                      </div>
                      
                      <div className="flex justify-between mb-3">
                        <span className="text-white/70">Origin:</span>
                        <span className="flex items-center">
                          {form.getValues("originCountry") && (
                            <img 
                              src={getCountryFlag(form.getValues("originCountry"))} 
                              alt={getCountryName(form.getValues("originCountry"))} 
                              className="h-4 mr-2"
                            />
                          )}
                          {getCountryName(form.getValues("originCountry"))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between mb-3">
                        <span className="text-white/70">Total Value:</span>
                        <span>{formatCurrency((calculateTotal(form.getValues("productValue") || "0", form.getValues("externalPaymentMethod") || "balance") * 1.05).toString())}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-white/70">Status:</span>
                        <Badge className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30">Processing</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                      <Button 
                        variant="outline" 
                        className="border-white/10 bg-white/5 hover:bg-white/10"
                        onClick={() => router.push("/dashboard")}
                      >
                        Go to Dashboard
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white"
                        onClick={() => router.push("/dashboard/imports")}
                      >
                        View My Imports
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
              
              {step !== "confirmation" && (
                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                  {step !== "details" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="border-white/10 text-white/80 hover:bg-white/5"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    className={cn(
                      "ml-auto bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white",
                      isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                    disabled={isSubmitting}
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
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="container mx-auto">
        <div className="flex min-h-screen">
          {renderSidebar()}
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
}