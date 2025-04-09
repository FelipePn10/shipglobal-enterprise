"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronRight, Loader2, Package2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"; // Adicionado DialogTitle
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

import { type ImportFormValues, importFormSchema } from "../../../types/types";
import { popularCountries, productCategories } from "../../../data/data";

import { SidebarHelpBox, SidebarSteps } from "../../../components/imports/sidebar-steps";
import { PaymentConfirmation } from "@/components/imports/payment-confirmator";
import { PaymentMethodSelector } from "@/components/imports/payment-method-selector";
import { PaymentStep } from "@/components/imports/payment-step";
import { PersonalInfoForm } from "@/components/imports/personal-info-form";
import { ProductInfoForm } from "@/components/imports/product-info-form";
import { TermsCheckbox } from "@/components/imports/terms-checkbox";
import { ShippingAddressForm } from "@/components/imports/shipping-addres-form";

export function NewImportModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
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

  useEffect(() => {
    if (paymentMethod === "external" && !externalPaymentMethod) {
      form.setValue("externalPaymentMethod", "credit");
    }
  }, [paymentMethod, externalPaymentMethod, form]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("details");
      form.reset();
      setIsPaymentComplete(false);
    }, 300);
  };

  const onSubmit = async (data: ImportFormValues) => {
    const effectiveSession = process.env.NODE_ENV === "development" && !session?.user
      ? { user: { id: "1", type: "user" } }
      : session;

    if (!effectiveSession?.user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para criar uma importação",
        variant: "destructive",
      });
      return;
    }

    if (step === "details") {
      if (!data.acceptTerms) {
        form.setError("acceptTerms", {
          type: "required",
          message: "You must accept the terms to proceed",
        });
        toast({
          title: "Erro",
          description: "Você deve aceitar os termos para continuar",
          variant: "destructive",
        });
        return;
      }

      if (data.paymentMethod === "external") {
        if (!data.externalPaymentMethod) {
          form.setError("externalPaymentMethod", {
            type: "required",
            message: "Please select a payment method",
          });
          toast({
            title: "Erro",
            description: "Selecione um método de pagamento",
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
              title: "Erro",
              description: "Preencha todos os detalhes do cartão",
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
            title: "Erro",
            description: "Insira seu e-mail do PayPal",
            variant: "destructive",
          });
          return;
        }
      }

      setStep("payment");
      return;
    }

    if (step === "payment") {
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
          title: `Importação de ${data.productCategory}`,
          origin: data.originCountry,
          destination: `${data.address.city}, ${data.address.state}`,
          status: "draft",
          progress: 0,
        };

        const response = await fetch("/api/imports", {
          method: "POST",
          headers,
          body: JSON.stringify(importData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao criar importação");
        }

        const newImport = await response.json();
        setIsSubmitting(false);
        setIsPaymentComplete(true);
        setStep("confirmation");
        toast({
          title: "Sucesso",
          description: "Importação criada com sucesso!",
        });
      } catch (error) {
        setIsSubmitting(false);
        toast({
          title: "Erro ao criar importação",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      }
    }

    if (step === "confirmation") {
      handleClose();
      router.refresh();
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
    const country = popularCountries.find((c) => c.value === countryCode);
    return country ? country.label : countryCode;
  };

  const getCategoryName = (categoryCode: string) => {
    const category = productCategories.find((c) => c.value === categoryCode);
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

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState && isSubmitting) return;
        setOpen(openState);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
          <Package2 className="h-4 w-4 mr-2" />
          New Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1000px] p-0 gap-0 bg-black/95 border-white/10 text-white">
        <DialogTitle className="sr-only">New Import Modal</DialogTitle> {/* Adicionado para acessibilidade */}
        <div className="flex flex-col md:flex-row h-[80vh] md:max-h-[650px]">
          <div className="md:w-64 bg-white/5 p-6 flex flex-col">
            <SidebarSteps step={step} />
            <div className="mt-auto pt-6">
              <SidebarHelpBox step={step} paymentMethod={paymentMethod} />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  {step === "details" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">Import Details</h2>
                        <p className="text-white/60 text-sm">Fill in the information about your import</p>
                      </div>
                      <div className="space-y-4">
                        <PersonalInfoForm control={form.control} formatCPF={formatCPF} />
                        <ShippingAddressForm control={form.control} formatZipCode={formatZipCode} />
                        <ProductInfoForm control={form.control} getCountryFlag={getCountryFlag} />
                        <PaymentMethodSelector
                          control={form.control}
                          watch={form.watch}
                          setValue={form.setValue}
                          formatCurrency={formatCurrency}
                          calculateFees={calculateFees}
                          calculateTotal={calculateTotal}
                        />
                        <TermsCheckbox control={form.control} />
                      </div>
                    </div>
                  )}

                  {step === "payment" && (
                    <PaymentStep
                      watch={form.watch}
                      formatCurrency={formatCurrency}
                      getCountryName={getCountryName}
                      getCategoryName={getCategoryName}
                      getCountryFlag={getCountryFlag}
                      calculateFees={calculateFees}
                      calculateTotal={calculateTotal}
                    />
                  )}

                  {step === "confirmation" && (
                    <PaymentConfirmation
                      getValues={form.getValues}
                      formatCurrency={formatCurrency}
                      getCountryName={getCountryName}
                      getCategoryName={getCategoryName}
                      getCountryFlag={getCountryFlag}
                      paymentMethod={paymentMethod as "balance" | "external"}
                      externalPaymentMethod={externalPaymentMethod as "credit" | "debit" | "paypal" | "pix"}
                    />
                  )}
                </ScrollArea>

                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                  {step !== "details" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step === "payment" ? "details" : "payment")}
                      className="border-white/10 text-white/80 hover:bg-white/5"
                    >
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
                    {step === "details" && "Continue"}
                    {step === "payment" && "Complete Payment"}
                    {step === "confirmation" && "Close"}
                    {step !== "confirmation" && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}