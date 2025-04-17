"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building,
  CheckCircle2,
  Map,
  Phone,
  Briefcase,
  Globe,
  MapPin,
  Hash,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import ElegantShape from "@/components/kokonutui/elegant-shape";

// Define interfaces for form data and errors
interface FormData {
  companyName: string;
  cnpj: string;
  corporateEmail: string;
  adminFirstName: string;
  adminLastName: string;
  industry: string;
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  adminPhone: string;
  companyPhone: string;
  password: string;
  agreeTerms: boolean;
  hasPurchaseManager: boolean;
}

interface FormErrors {
  [key: string]: string | undefined;
  companyName?: string;
  cnpj?: string;
  corporateEmail?: string;
  adminFirstName?: string;
  adminLastName?: string;
  industry?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  number?: string;
  adminPhone?: string;
  companyPhone?: string;
  password?: string;
  agreeTerms?: string;
  general?: string;
}

/**
 * Enterprise registration page with multi-step form
 */
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form Part 1, 2: Form Part 2, 3: Manager Choice
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    cnpj: "",
    corporateEmail: "",
    adminFirstName: "",
    adminLastName: "",
    industry: "",
    country: "Brasil",
    state: "",
    city: "",
    street: "",
    number: "",
    adminPhone: "",
    companyPhone: "",
    password: "",
    agreeTerms: false,
    hasPurchaseManager: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const requiredFields = [
      "companyName",
      "cnpj",
      "corporateEmail",
      "adminFirstName",
      "adminLastName",
      "industry",
      "country",
      "state",
      "city",
      "street",
      "number",
      "adminPhone",
      "companyPhone",
      "password",
    ];

    const filledFields = requiredFields.filter(
      (field) => formData[field as keyof FormData] !== ""
    ).length;

    const termsProgress = formData.agreeTerms ? 1 : 0;
    setFormProgress(
      (filledFields / requiredFields.length) * 90 + termsProgress * 10
    );
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (checked && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!formData.companyName)
      newErrors.companyName = "Nome da empresa é obrigatório";
    if (
      !formData.cnpj ||
      !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)
    )
      newErrors.cnpj = "CNPJ inválido (formato: XX.XXX.XXX/XXXX-XX)";
    if (
      !formData.corporateEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.corporateEmail)
    )
      newErrors.corporateEmail = "Email corporativo inválido";
    if (!formData.adminFirstName)
      newErrors.adminFirstName = "Nome do administrador é obrigatório";
    if (!formData.adminLastName)
      newErrors.adminLastName = "Sobrenome do administrador é obrigatório";
    if (!formData.industry)
      newErrors.industry = "Ramo de atuação é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};
    if (!formData.country) newErrors.country = "País é obrigatório";
    if (!formData.state) newErrors.state = "Estado é obrigatório";
    if (!formData.city) newErrors.city = "Cidade é obrigatória";
    if (!formData.street) newErrors.street = "Rua é obrigatória";
    if (!formData.number) newErrors.number = "Número é obrigatório";
    if (
      !formData.adminPhone ||
      !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.adminPhone)
    )
      newErrors.adminPhone =
        "Telefone do administrador inválido (formato: (XX) XXXXX-XXXX)";
    if (
      !formData.companyPhone ||
      !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.companyPhone)
    )
      newErrors.companyPhone =
        "Telefone da empresa inválido (formato: (XX) XXXXX-XXXX)";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Senha deve ter pelo menos 8 caracteres";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "Você deve concordar com os termos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) setStep(3);
  };

  const handleFinalSubmit = async (withManager: boolean) => {
    setLoading(true);
    const updatedFormData = { ...formData, hasPurchaseManager: withManager };
    setFormData(updatedFormData);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (res.ok) {
        router.push("/auth/login?registered=true");
      } else {
        const errorData = await res.json();
        setErrors({
          general: errorData.error || "Falha no registro. Tente novamente.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Erro no servidor. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  // Determine which form to show based on step
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.form
            custom={1}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleStep1Submit}
            aria-label="Informações da Empresa"
          >
            <div className="space-y-4 my-6">
              <div className="space-y-1">
                <Label
                  htmlFor="companyName"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-indigo-400" /> Nome da Empresa
                </Label>
                <div className="relative">
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Ex: Empresa XYZ"
                    className={cn(
                      "pl-3 bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                      errors.companyName && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.companyName}
                    aria-describedby={
                      errors.companyName ? "companyName-error" : undefined
                    }
                  />
                </div>
                {errors.companyName && (
                  <p id="companyName-error" className="text-rose-400 text-xs">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="cnpj"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Hash className="h-4 w-4 text-indigo-400" /> CNPJ
                </Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  className={cn(
                    "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                    errors.cnpj && "border-rose-500/50"
                  )}
                  disabled={loading}
                  aria-invalid={!!errors.cnpj}
                  aria-describedby={errors.cnpj ? "cnpj-error" : undefined}
                />
                {errors.cnpj && (
                  <p id="cnpj-error" className="text-rose-400 text-xs">
                    {errors.cnpj}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="corporateEmail"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-indigo-400" /> Email Corporativo
                </Label>
                <Input
                  id="corporateEmail"
                  name="corporateEmail"
                  type="email"
                  value={formData.corporateEmail}
                  onChange={handleChange}
                  placeholder="contato@empresa.com"
                  className={cn(
                    "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                    errors.corporateEmail && "border-rose-500/50"
                  )}
                  disabled={loading}
                  aria-invalid={!!errors.corporateEmail}
                  aria-describedby={
                    errors.corporateEmail ? "corporateEmail-error" : undefined
                  }
                />
                {errors.corporateEmail && (
                  <p id="corporateEmail-error" className="text-rose-400 text-xs">
                    {errors.corporateEmail}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="adminFirstName"
                    className="text-white/80 flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-indigo-400" /> Nome
                  </Label>
                  <Input
                    id="adminFirstName"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    placeholder="João"
                    className={cn(
                      "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                      errors.adminFirstName && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.adminFirstName}
                    aria-describedby={
                      errors.adminFirstName ? "adminFirstName-error" : undefined
                    }
                  />
                  {errors.adminFirstName && (
                    <p id="adminFirstName-error" className="text-rose-400 text-xs">
                      {errors.adminFirstName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="adminLastName"
                    className="text-white/80 flex items-center gap-2"
                  >
                    Sobrenome
                  </Label>
                  <Input
                    id="adminLastName"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleChange}
                    placeholder="Silva"
                    className={cn(
                      "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                      errors.adminLastName && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.adminLastName}
                    aria-describedby={
                      errors.adminLastName ? "adminLastName-error" : undefined
                    }
                  />
                  {errors.adminLastName && (
                    <p id="adminLastName-error" className="text-rose-400 text-xs">
                      {errors.adminLastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="industry"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4 text-indigo-400" /> Ramo de
                  Atuação
                </Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Ex: Tecnologia"
                  className={cn(
                    "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                    errors.industry && "border-rose-500/50"
                  )}
                  disabled={loading}
                  aria-invalid={!!errors.industry}
                  aria-describedby={errors.industry ? "industry-error" : undefined}
                />
                {errors.industry && (
                  <p id="industry-error" className="text-rose-400 text-xs">
                    {errors.industry}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 transition-all duration-200 font-medium"
            >
              {loading ? "Carregando..." : "Próximo"}
            </Button>
          </motion.form>
        );

      case 2:
        return (
          <motion.form
            custom={1}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleStep2Submit}
            aria-label="Informações de Contato"
          >
            <div className="space-y-4 my-6">
              <div className="space-y-1">
                <Label
                  htmlFor="country"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Globe className="h-4 w-4 text-indigo-400" /> País
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Brasil"
                  className={cn(
                    "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                    errors.country && "border-rose-500/50"
                  )}
                  disabled={loading}
                  aria-invalid={!!errors.country}
                  aria-describedby={errors.country ? "country-error" : undefined}
                />
                {errors.country && (
                  <p id="country-error" className="text-rose-400 text-xs">
                    {errors.country}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="state"
                    className="text-white/80 flex items-center gap-2"
                  >
                    <Map className="h-4 w-4 text-indigo-400" /> Estado
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="SP"
                    className={cn(
                      "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                      errors.state && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.state}
                    aria-describedby={errors.state ? "state-error" : undefined}
                  />
                  {errors.state && (
                    <p id="state-error" className="text-rose-400 text-xs">
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="city"
                    className="text-white/80 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-indigo-400" /> Cidade
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="São Paulo"
                    className={cn(
                      "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                      errors.city && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "city-error" : undefined}
                  />
                  {errors.city && (
                    <p id="city-error" className="text-rose-400 text-xs">
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="street" className="text-white/80">
                    Rua
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Av. Principal"
                    className={cn(
                      "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                      errors.street && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.street}
                    aria-describedby={errors.street ? "street-error" : undefined}
                  />
                  {errors.street && (
                    <p id="street-error" className="text-rose-400 text-xs">
                      {errors.street}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="number" className="text-white/80">
                    Número
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="123"
                    className={cn(
                      "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                      errors.number && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.number}
                    aria-describedby={errors.number ? "number-error" : undefined}
                  />
                  {errors.number && (
                    <p id="number-error" className="text-rose-400 text-xs">
                      {errors.number}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="adminPhone"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-indigo-400" /> Telefone do
                  Administrador
                </Label>
                <Input
                  id="adminPhone"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className={cn(
                    "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                    errors.adminPhone && "border-rose-500/50"
                  )}
                  disabled={loading}
                  aria-invalid={!!errors.adminPhone}
                  aria-describedby={
                    errors.adminPhone ? "adminPhone-error" : undefined
                  }
                />
                {errors.adminPhone && (
                  <p id="adminPhone-error" className="text-rose-400 text-xs">
                    {errors.adminPhone}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="companyPhone"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-indigo-400" /> Telefone da
                  Empresa
                </Label>
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleChange}
                  placeholder="(11) 3333-3333"
                  className={cn(
                    "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11",
                    errors.companyPhone && "border-rose-500/50"
                  )}
                  disabled={loading}
                  aria-invalid={!!errors.companyPhone}
                  aria-describedby={
                    errors.companyPhone ? "companyPhone-error" : undefined
                  }
                />
                {errors.companyPhone && (
                  <p id="companyPhone-error" className="text-rose-400 text-xs">
                    {errors.companyPhone}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-white/80 flex items-center gap-2"
                >
                  <Lock className="h-4 w-4 text-indigo-400" /> Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={cn(
                      "bg-white/5 border-white/10 focus:border-indigo-500/50 h-11 pr-10",
                      errors.password && "border-rose-500/50"
                    )}
                    disabled={loading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-rose-400 text-xs">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2 py-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("agreeTerms", checked as boolean)
                  }
                  className="border-white/30 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                  aria-invalid={!!errors.agreeTerms}
                  aria-describedby={
                    errors.agreeTerms ? "agreeTerms-error" : undefined
                  }
                />
                <Label
                  htmlFor="agreeTerms"
                  className={cn(
                    "text-sm leading-tight",
                    errors.agreeTerms ? "text-rose-400" : "text-white/70"
                  )}
                >
                  Concordo com os{" "}
                  <Link href="/terms" className="text-indigo-400 hover:underline">
                    Termos
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="/privacy"
                    className="text-indigo-400 hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                </Label>
              </div>
              {errors.agreeTerms && (
                <p id="agreeTerms-error" className="text-rose-400 text-xs -mt-2">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="w-1/3 h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                disabled={loading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="w-2/3 h-11 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 transition-all duration-200 font-medium"
              >
                {loading ? "Carregando..." : "Finalizar"}
              </Button>
            </div>
          </motion.form>
        );

      case 3:
        return (
          <motion.div
            custom={1}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6 my-6"
            role="region"
            aria-label="Escolha do Tipo de Conta"
          >
            <div className="text-center mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Estamos quase lá!</h2>
              <p className="text-white/70 mt-2">
                Escolha o tipo de conta para sua empresa
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.1] rounded-lg cursor-pointer hover:border-indigo-500/50 transition-all duration-200"
                onClick={() => handleFinalSubmit(false)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleFinalSubmit(false);
                  }
                }}
                aria-label="Selecionar Conta Padrão"
              >
                <h3 className="text-white font-medium flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-indigo-400" />
                  Conta Padrão
                </h3>
                <p className="text-white/60 text-sm ml-7">
                  Acesso imediato à plataforma sem gerente de compras dedicado.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-gradient-to-br from-indigo-500/[0.15] to-rose-500/[0.08] border border-white/[0.15] rounded-lg cursor-pointer hover:border-indigo-500/70 transition-all duration-200"
                onClick={() => handleFinalSubmit(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleFinalSubmit(true);
                  }
                }}
                aria-label="Selecionar Conta com Gerente de Compras"
              >
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                  RECOMENDADO
                </div>
                <h3 className="text-white font-medium flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-indigo-400" />
                  Conta com Gerente de Compras
                </h3>
                <p className="text-white/70 text-sm ml-7">
                  Inclui um gerente pessoal para otimizar seus processos de
                  importação.
                  <span className="block mt-1 text-white/50">
                    Aguarde até 1 dia para aprovação (custos adicionais após
                    aprovação).
                  </span>
                </p>
              </motion.div>
            </div>

            {errors.general && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg">
                <p className="text-rose-400 text-center text-sm">
                  {errors.general}
                </p>
              </div>
            )}

            <Button
              type="button"
              onClick={() => setStep(2)}
              variant="outline"
              className="w-full h-10 border-white/10 bg-white/5 hover:bg-white/10 text-white"
              disabled={loading}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Voltar para o formulário
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303]">
      {/* Background gradients and shapes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(120,80,255,0.15),transparent_70%),radial-gradient(circle_at_25%_60%,rgba(255,100,150,0.1),transparent_50%)]" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={800}
          height={200}
          rotate={10}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.5}
          width={700}
          height={180}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[65%] md:top-[70%]"
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="bg-black/30 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-xl">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-6"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
              <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center transition-all group-hover:scale-110">
                <Image
                  src="https://kokonutui.com/logo.svg"
                  alt="Redirex Solutions"
                  width={20}
                  height={20}
                  className="relative z-10"
                />
              </div>
              <span className="text-xl font-bold text-white">Redirex</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">
              Criar Conta Empresarial
            </h1>
            <p className="text-white/60">
              Registre sua empresa para acessar nossa plataforma
            </p>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-rose-500"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-2 px-2">
              <span
                className={`text-xs ${
                  step >= 1 ? "text-indigo-400" : "text-white/30"
                }`}
              >
                Empresa
              </span>
              <span
                className={`text-xs ${
                  step >= 2 ? "text-indigo-400" : "text-white/30"
                }`}
              >
                Contato
              </span>
              <span
                className={`text-xs ${
                  step >= 3 ? "text-indigo-400" : "text-white/30"
                }`}
              >
                Finalizar
              </span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            {renderFormStep()}
          </AnimatePresence>

          {errors.general && step < 3 && (
            <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg">
              <p className="text-rose-400 text-center text-sm">
                {errors.general}
              </p>
            </div>
          )}

          {step < 3 && (
            <div className="mt-6 text-center">
              <p className="text-white/50 text-sm">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-indigo-400 hover:underline"
                >
                  Faça login
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-white/40 text-xs">
            © 2025 Redirex Solutions. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}