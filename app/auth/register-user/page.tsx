'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, Calendar, CheckCircle2, Map, Phone, CreditCard, Globe, MapPin, ChevronLeft, Package, Home, BadgeCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ElegantShape from '@/components/kokonutui/elegant-shape';
import { register } from '@/lib/api/auth';
import type { RegisterData } from '@/lib/api/auth/types/auth';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  cpf: string;
  password: string;
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  complement: string;
  zipCode: string;
  phone: string;
  occupation: string;
  agreeTerms: boolean;
  selectedPlan: string;
}

interface FormErrors {
  [key: string]: string;
}

const plans = [
  { id: 'BASIC', name: 'Plano Básico', description: 'Redirecionamento padrão sem taxas mensais.', price: 'Grátis', icon: Package },
  { id: 'PREMIUM', name: 'Plano Premium', description: 'Consolidação de pacotes, fotos dos itens e rastreamento prioritário.', price: 'R$ 29,90 / mês', icon: CreditCard, isPopular: true },
  { id: 'EXCLUSIVE', name: 'Plano Exclusivo', description: 'Todos os benefícios do Premium + endereço exclusivo nos EUA e suporte prioritário.', price: 'R$ 79,90 / mês', icon: Home },
];

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
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function RegisterUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    cpf: '',
    password: '',
    country: 'Brasil',
    state: '',
    city: '',
    street: '',
    number: '',
    complement: '',
    zipCode: '',
    phone: '',
    occupation: '',
    agreeTerms: false,
    selectedPlan: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const requiredFields: (keyof FormData)[] = [
      'firstName', 'lastName', 'email', 'birthDate', 'cpf', 'password',
      'country', 'state', 'city', 'street', 'number', 'zipCode',
      'phone', 'occupation'
    ];
    
    const filledFields = requiredFields.filter(field => 
      formData[field] !== '' && formData[field] !== false
    ).length;
    
    const termsProgress = formData.agreeTerms ? 1 : 0;
    setFormProgress(
      ((filledFields / requiredFields.length) * 90) + (termsProgress * 10)
    );
  }, [formData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const maskedValue = () => {
      switch (name) {
        case 'cpf':
          return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .slice(0, 14);
        case 'phone':
          return value
            .replace(/\D/g, '')
            .replace(/(\d{0})(\d{2})(\d{0})/, '($1$2) ')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
        case 'zipCode':
          return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 9);
        default:
          return value;
      }
    };

    setFormData(prev => ({ ...prev, [name]: maskedValue() }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleCheckboxChange = useCallback((name: keyof FormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const validateStep1 = useCallback(() => {
    const newErrors: FormErrors = {};
    const cleanCpf = formData.cpf.replace(/\D/g, '');
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório';
    if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório';
    if (!cleanCpf || cleanCpf.length !== 11) newErrors.cpf = 'CPF inválido';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Email inválido';
    if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
    if (formData.password.length < 8) newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    if (!formData.occupation.trim()) newErrors.occupation = 'Ocupação é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const validateStep2 = useCallback(() => {
    const newErrors: FormErrors = {};
    const cleanZipCode = formData.zipCode.replace(/\D/g, '');
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    if (!formData.country.trim()) newErrors.country = 'País é obrigatório';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!cleanZipCode || cleanZipCode.length !== 8) newErrors.zipCode = 'CEP inválido';
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 11) newErrors.phone = 'Telefone inválido';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Você deve concordar com os termos';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleStep1Submit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  }, [validateStep1]);

  const handleStep2Submit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep2()) setStep(3);
  }, [validateStep2]);

  const handleFinalSubmit = useCallback(async (planId: string) => {
    setLoading(true);
    try {
      const payload: RegisterData = {
        fullname: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        occupation: formData.occupation,
        role: planId,
        addresses: [{
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipCode.replace(/\D/g, ''),
          country: formData.country
        }]
      };

      await register(payload);
      router.push('/auth/login?registered=true');
    } catch (error: any) {
      const backendError = error.response?.data;
      const newErrors: FormErrors = {};

      if (backendError?.errors) {
        backendError.errors.forEach((err: { field: string; message: string }) => {
          const fieldMap: { [key: string]: string } = {
            'fullname': 'firstName',
            'email': 'email',
            'cpf': 'cpf',
            'phone': 'phone',
            'password': 'password',
            'addresses[0].street': 'street',
            'addresses[0].number': 'number',
            'addresses[0].city': 'city',
            'addresses[0].state': 'state',
            'addresses[0].zipcode': 'zipCode',
            'addresses[0].country': 'country'
          };
          newErrors[fieldMap[err.field] || err.field] = err.message;
        });
      } else {
        newErrors.general = backendError?.message || 'Erro ao registrar usuário';
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

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
            className="space-y-4 my-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-white/80 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-400" /> Nome
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="João"
                  className={cn(
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                    errors.firstName && 'border-rose-500/50'
                  )}
                />
                {errors.firstName && <p className="text-rose-400 text-xs">{errors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-white/80">
                  Sobrenome
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Silva"
                  className={cn(
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                    errors.lastName && 'border-rose-500/50'
                  )}
                />
                {errors.lastName && <p className="text-rose-400 text-xs">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-white/80 flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" /> Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={cn(
                  'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                  errors.email && 'border-rose-500/50'
                )}
              />
              {errors.email && <p className="text-rose-400 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cpf" className="text-white/80 flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-indigo-400" /> CPF
              </Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className={cn(
                  'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                  errors.cpf && 'border-rose-500/50'
                )}
              />
              {errors.cpf && <p className="text-rose-400 text-xs">{errors.cpf}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="birthDate" className="text-white/80 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" /> Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className={cn(
                  'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                  errors.birthDate && 'border-rose-500/50'
                )}
              />
              {errors.birthDate && <p className="text-rose-400 text-xs">{errors.birthDate}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="occupation" className="text-white/80 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-400" /> Ocupação
              </Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Sua profissão"
                className={cn(
                  'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                  errors.occupation && 'border-rose-500/50'
                )}
              />
              {errors.occupation && <p className="text-rose-400 text-xs">{errors.occupation}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-white/80 flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-400" /> Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={cn(
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11 pr-10',
                    errors.password && 'border-rose-500/50'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 font-medium"
            >
              {loading ? 'Carregando...' : 'Próximo'}
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
            className="space-y-4 my-6"
          >
            <div className="space-y-1">
              <Label htmlFor="country" className="text-white/80 flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-400" /> País
              </Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={cn(
                  'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                  errors.country && 'border-rose-500/50'
                )}
              />
              {errors.country && <p className="text-rose-400 text-xs">{errors.country}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="state" className="text-white/80 flex items-center gap-2">
                  <Map className="h-4 w-4 text-indigo-400" /> Estado
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="SP"
                  className={cn(
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                    errors.state && 'border-rose-500/50'
                  )}
                />
                {errors.state && <p className="text-rose-400 text-xs">{errors.state}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="city" className="text-white/80 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-400" /> Cidade
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="São Paulo"
                  className={cn(
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                    errors.city && 'border-rose-500/50'
                  )}
                />
                {errors.city && <p className="text-rose-400 text-xs">{errors.city}</p>}
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
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                    errors.street && 'border-rose-500/50'
                  )}
                />
                {errors.street && <p className="text-rose-400 text-xs">{errors.street}</p>}
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
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                    errors.number && 'border-rose-500/50'
                  )}
                />
                {errors.number && <p className="text-rose-400 text-xs">{errors.number}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="complement" className="text-white/80">
                  Complemento
                </Label>
                <Input
                  id="complement"
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  placeholder="Apto 42"
                  className="bg-white/5 border-white/10 focus:border-indigo-500/50 h-11"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="zipCode" className="text-white/80">
                  CEP
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className={cn(
                    'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                    errors.zipCode && 'border-rose-500/50'
                  )}
                />
                {errors.zipCode && <p className="text-rose-400 text-xs">{errors.zipCode}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-white/80 flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-400" /> Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className={cn(
                  'bg-white/5 border-white/10 focus:border-indigo-500/50 h-11',
                  errors.phone && 'border-rose-500/50'
                )}
              />
              {errors.phone && <p className="text-rose-400 text-xs">{errors.phone}</p>}
            </div>

            <div className="flex items-start space-x-2 py-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('agreeTerms', checked as boolean)
                }
                className="border-white/30 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
              />
              <Label htmlFor="agreeTerms" className={cn(
                'text-sm leading-tight',
                errors.agreeTerms ? 'text-rose-400' : 'text-white/70'
              )}>
                Concordo com os{' '}
                <Link href="/terms" className="text-indigo-400 hover:underline">
                  Termos
                </Link>{' '}
                e{' '}
                <Link href="/privacy" className="text-indigo-400 hover:underline">
                  Política de Privacidade
                </Link>
              </Label>
            </div>
            {errors.agreeTerms && <p className="text-rose-400 text-xs -mt-2">{errors.agreeTerms}</p>}

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="w-1/3 h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-2/3 h-11 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 font-medium"
              >
                {loading ? 'Carregando...' : 'Finalizar'}
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
          >
            <div className="text-center mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white">Estamos quase lá!</h2>
              <p className="text-white/70 mt-2">Escolha seu plano de redirecionamento</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    'p-5 border rounded-lg cursor-pointer hover:border-indigo-500/70 transition-all duration-200 relative',
                    plan.isPopular
                      ? 'bg-gradient-to-br from-indigo-500/[0.15] to-rose-500/[0.08] border-white/[0.15]'
                      : 'bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-white/[0.1]'
                  )}
                  onClick={() => handleFinalSubmit(plan.id)}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      MAIS POPULAR
                    </div>
                  )}
                  <h3 className="text-white font-medium flex items-center">
                    <plan.icon className="h-5 w-5 mr-2 text-indigo-400" />
                    {plan.name}
                  </h3>
                  <p className="text-white/70 text-sm ml-7">{plan.description}</p>
                  <div className="ml-7 mt-2 text-white/80 font-medium">{plan.price}</div>
                </motion.div>
              ))}
            </div>

            {(errors.general || errors.details) && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg">
                <p className="text-rose-400 text-center text-sm">{errors.general}</p>
                {errors.details && (
                  <p className="text-rose-400 text-center text-xs mt-1">{errors.details}</p>
                )}
              </div>
            )}

            <Button
              type="button"
              onClick={() => setStep(2)}
              variant="outline"
              className="w-full h-10 border-white/10 bg-white/5 hover:bg-white/10 text-white"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Voltar para o formulário
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303]">
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

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="bg-black/30 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-xl">
          <motion.header
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
            <h1 className="text-2xl font-bold text-white mb-2">Criar Conta Pessoal</h1>
            <p className="text-white/60">
              Registre-se para utilizar nossos serviços de redirecionamento internacional
            </p>
            <div className="w-full h-1 bg-white/10 rounded-full mt-5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-rose-500"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <nav className="flex justify-between mt-2 px-2" aria-label="Form progress">
              <span className={`text-xs ${step >= 1 ? 'text-indigo-400' : 'text-white/30'}`}>
                Pessoal
              </span>
              <span className={`text-xs ${step >= 2 ? 'text-indigo-400' : 'text-white/30'}`}>
                Endereço
              </span>
              <span className={`text-xs ${step >= 3 ? 'text-indigo-400' : 'text-white/30'}`}>
                Plano
              </span>
            </nav>
          </motion.header>

          <AnimatePresence mode="wait" initial={false}>
            {renderFormStep()}
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-6 text-center">
              <p className="text-white/50 text-sm">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="text-indigo-400 hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          )}

          {step === 3 && (
            <p className="text-center text-xs text-white/40 mt-6">
              Você poderá alterar seu plano a qualquer momento após o registro.
            </p>
          )}
        </div>

        <footer className="text-center mt-6">
          <p className="text-xs text-white/40">
            © 2025 Redirex Solutions. Todos os direitos reservados.
          </p>
          <nav className="flex justify-center gap-4 mt-3" aria-label="Footer links">
            <Link href="/terms" className="text-xs text-white/60 hover:text-white/90">
              Termos
            </Link>
            <Link href="/privacy" className="text-xs text-white/60 hover:text-white/90">
              Privacidade
            </Link>
            <Link href="/contact" className="text-xs text-white/60 hover:text-white/90">
              Contato
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}