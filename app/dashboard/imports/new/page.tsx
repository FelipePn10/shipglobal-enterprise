"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import { PaymentMethodSelector } from "@/components/imports/payment-method-selector";
import { popularCountries, productCategories } from "@/data/data";
import { type ImportFormValues, importFormSchema } from "@/types/types";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { ShippingAddressForm } from "@/components/imports/shipping-addres-form";

export default function NewImportPage() {
  const [step, setStep] = useState<"details" | "address" | "product" | "payment" | "review" | "confirmation">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(20);
  const { data: session, status } = useSession();
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
    mode: "onChange",
  });

  const paymentMethod = form.watch("paymentMethod");
  const externalPaymentMethod = form.watch("externalPaymentMethod");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (paymentMethod === "external" && !externalPaymentMethod) {
      form.setValue("externalPaymentMethod", "credit");
    }
    switch (step) {
      case "details": setProgressPercentage(20); break;
      case "address": setProgressPercentage(40); break;
      case "product": setProgressPercentage(60); break;
      case "payment": setProgressPercentage(80); break;
      case "review": setProgressPercentage(90); break;
      case "confirmation": setProgressPercentage(100); break;
    }
  }, [paymentMethod, externalPaymentMethod, step, form]);

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast({
        title: "Please check your information",
        description: "Some required fields need to be completed correctly.",
        variant: "destructive",
      });
      return;
    }
    const steps = ["details", "address", "product", "payment", "review", "confirmation"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as any);
    }
  };

  const handlePreviousStep = () => {
    const steps = ["details", "address", "product", "payment", "review", "confirmation"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as any);
    }
  };

  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = [];
    switch (step) {
      case "details": fieldsToValidate = ["fullName", "cpf"]; break;
      case "address": fieldsToValidate = ["address.street", "address.number", "address.city", "address.state", "address.zipCode"]; break;
      case "product": fieldsToValidate = ["productCategory", "originCountry", "productValue"]; break;
      case "payment":
        fieldsToValidate = ["paymentMethod"];
        if (paymentMethod === "external") {
          fieldsToValidate.push("externalPaymentMethod");
          if (["credit", "debit"].includes(externalPaymentMethod || "")) {
            fieldsToValidate.push("creditCard.number", "creditCard.expiry", "creditCard.cvc", "creditCard.name");
          } else if (externalPaymentMethod === "paypal") {
            fieldsToValidate.push("paypalEmail");
          }
        }
        break;
      case "review": fieldsToValidate = ["acceptTerms"]; break;
    }
    return await form.trigger(fieldsToValidate as any);
  };

  const onSubmit = async (data: ImportFormValues) => {
    if (step !== "review" && step !== "confirmation") {
      await handleNextStep();
      return;
    }

    if (step === "review") {
      if (!data.acceptTerms) {
        form.setError("acceptTerms", { type: "required", message: "You must accept the terms to proceed" });
        toast({ title: "Error", description: "You must accept the terms to proceed", variant: "destructive" });
        return;
      }

      setIsSubmitting(true);
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (session?.user.type === "company" && session?.user.companyId) {
          headers["company-id"] = session.user.companyId;
        } else if (session?.user.id) {
          headers["user-id"] = session.user.id;
        }

        const importData = {
          title: `Import of ${getCategoryName(data.productCategory)}`,
          origin: data.originCountry,
          destination: `${data.address.city}, ${data.address.state}`,
          status: "processing",
          progress: 0,
          productValue: Number(data.productValue),
          paymentMethod: data.paymentMethod === "external" ? data.externalPaymentMethod : data.paymentMethod,
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

        await response.json();
        setStep("confirmation");
        toast({ title: "Success", description: "Your import was created successfully!", variant: "default" });
      } catch (error) {
        toast({
          title: "Error creating import",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (step === "confirmation") {
      router.push("/dashboard/imports");
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = Number.parseFloat(value);
    return isNaN(numValue) ? "R$ 0,00" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numValue);
  };

  const formatCPF = (value: string) => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").substring(0, 14);
  const formatZipCode = (value: string) => value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 9);
  const getCountryFlag = (code: string) => `https://flagcdn.com/w20/${code.toLowerCase()}.png`;
  const getCountryName = (code: string) => popularCountries.find((c) => c.value === code)?.label || code;
  const getCategoryName = (code: string) => productCategories.find((c) => c.value === code)?.label || code;
  const calculateFees = (amount: string, method: string) => {
    const value = Number.parseFloat(amount || "0");
    return { credit: value * 0.02, debit: value * 0.01, paypal: value * 0.025, pix: 0, balance: 0 }[method] || 0;
  };
  const calculateTotal = (amount: string, method: string) => Number.parseFloat(amount || "0") + calculateFees(amount, method);

  const renderStepIndicator = () => {
    const steps = [
      { key: "details", label: "Personal Info", icon: <User className="h-5 w-5" /> },
      { key: "address", label: "Shipping", icon: <MapPin className="h-5 w-5" /> },
      { key: "product", label: "Product", icon: <Package2 className="h-5 w-5" /> },
      { key: "payment", label: "Payment", icon: <DollarSign className="h-5 w-5" /> },
      { key: "review", label: "Review", icon: <Info className="h-5 w-5" /> },
    ];
    return (
      <div className="mb-8 px-6">
        <div className="flex justify-between">
          {steps.map((s, index) => {
            const isActive = step === s.key;
            const isPast = steps.findIndex((x) => x.key === step) > index;
            return (
              <div key={s.key} className={cn("flex flex-col items-center space-y-2", isActive ? "text-white" : isPast ? "text-purple-400" : "text-gray-500")}>
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", isActive ? "bg-gradient-to-r from-purple-600 to-pink-500" : isPast ? "bg-purple-600" : "bg-zinc-800")}>
                  {isPast ? <Check className="h-4 w-4 text-white" /> : s.icon}
                </div>
                <span className="text-xs hidden md:block">{s.label}</span>
              </div>
            );
          })}
        </div>
        <Progress value={progressPercentage} className="mt-4 h-1 bg-zinc-800" indicatorClassName="bg-gradient-to-r from-purple-600 to-pink-500" />
      </div>
    );
  };

  if (status === "loading") {
    return <DashboardLayout><div className="p-6 text-white">Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard/imports")} className="text-white/80 hover:bg-white/5">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Imports
          </Button>
          <h1 className="text-2xl font-bold text-white">{step === "confirmation" ? "Import Complete" : "Create New Import"}</h1>
          <div />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step !== "confirmation" && renderStepIndicator()}
            <ScrollArea className="h-[calc(100vh-200px)]">
              {step === "details" && (
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Personal Information</h2>
                    <PersonalInfoForm control={form.control} formatCPF={formatCPF} />
                  </CardContent>
                </Card>
              )}
              {step === "address" && (
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Shipping Address</h2>
                    <ShippingAddressForm control={form.control} formatZipCode={formatZipCode} />
                  </CardContent>
                </Card>
              )}
              {step === "product" && (
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Product Information</h2>
                    <ProductInfoForm control={form.control} getCountryFlag={getCountryFlag} />
                  </CardContent>
                </Card>
              )}
              {step === "payment" && (
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Payment Method</h2>
                    <PaymentMethodSelector control={form.control} watch={form.watch} setValue={form.setValue} formatCurrency={formatCurrency} calculateFees={calculateFees} calculateTotal={calculateTotal} />
                  </CardContent>
                </Card>
              )}
              {step === "review" && (
                <div className="space-y-6">
                  <Card className="border-white/10 bg-white/5">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-white mb-4">Review Your Import</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-2 flex items-center"><User className="h-4 w-4 mr-2" /> Personal Info</h3>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-white/60">Name:</dt><dd>{form.getValues("fullName")}</dd></div>
                            <div className="flex justify-between"><dt className="text-white/60">CPF:</dt><dd>{form.getValues("cpf")}</dd></div>
                          </dl>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-2 flex items-center"><MapPin className="h-4 w-4 mr-2" /> Shipping Address</h3>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-white/60">Street:</dt><dd>{form.getValues("address.street")}</dd></div>
                            <div className="flex justify-between"><dt className="text-white/60">City:</dt><dd>{form.getValues("address.city")}</dd></div>
                            <div className="flex justify-between"><dt className="text-white/60">State:</dt><dd>{form.getValues("address.state")}</dd></div>
                          </dl>
                        </div>
                      </div>
                      <Separator className="my-4 bg-white/10" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-2 flex items-center"><Package2 className="h-4 w-4 mr-2" /> Product Details</h3>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-white/60">Category:</dt><dd>{getCategoryName(form.getValues("productCategory"))}</dd></div>
                            <div className="flex justify-between"><dt className="text-white/60">Origin:</dt><dd>{getCountryName(form.getValues("originCountry"))}</dd></div>
                            <div className="flex justify-between"><dt className="text-white/60">Value:</dt><dd>{formatCurrency(form.getValues("productValue"))}</dd></div>
                          </dl>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-2 flex items-center"><CreditCard className="h-4 w-4 mr-2" /> Payment Info</h3>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-white/60">Method:</dt><dd>{paymentMethod === "balance" ? "Balance" : externalPaymentMethod}</dd></div>
                            <div className="flex justify-between"><dt className="text-white/60">Total:</dt><dd>{formatCurrency((calculateTotal(form.getValues("productValue"), externalPaymentMethod || "balance") * 1.05).toString())}</dd></div>
                          </dl>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-white/5">
                    <CardContent className="p-6">
                      <TermsCheckbox control={form.control} />
                    </CardContent>
                  </Card>
                </div>
              )}
              {step === "confirmation" && (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">Import Successfully Created!</h2>
                  <p className="text-white/60 mb-6">Your import is being processed. Track it in your dashboard.</p>
                  <Button onClick={() => router.push("/dashboard/imports")} className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white">View My Imports</Button>
                </div>
              )}
            </ScrollArea>
            {step !== "confirmation" && (
              <div className="flex justify-between p-6 border-t border-white/10">
                {step !== "details" && <Button variant="outline" onClick={handlePreviousStep} className="border-white/10 text-white/80 hover:bg-white/5">Back</Button>}
                <Button
                  type={step === "review" ? "submit" : "button"}
                  onClick={step !== "review" ? handleNextStep : undefined}
                  disabled={isSubmitting}
                  className="ml-auto bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {step === "review" ? "Complete Import" : "Continue"} {step !== "review" && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}