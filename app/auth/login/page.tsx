'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/authService';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ElegantShape from '@/components/kokonutui/elegant-shape';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
  details?: string;
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      try {
        const payload = {
          email: formData.email,
          senha: formData.password,
        };
        const { accessToken } = await loginUser(payload);
        // Armazenar o token (ex.: localStorage)
        localStorage.setItem('accessToken', accessToken);
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Erro completo:', error);
        setErrors({
          general: error.response?.data?.message || 'Erro ao fazer login',
          details: error.message || 'Verifique suas credenciais e tente novamente',
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, router, validateForm]
  );

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
            <h1 className="text-2xl font-bold text-white mb-2">Entrar na Conta</h1>
            <p className="text-white/60">
              Faça login para acessar os serviços de redirecionamento
            </p>
          </motion.header>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {(errors.general || errors.details) && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg">
                <p className="text-rose-400 text-center text-sm">{errors.general}</p>
                {errors.details && (
                  <p className="text-rose-400 text-center text-xs mt-1">{errors.details}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 font-medium"
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Não tem uma conta?{' '}
              <Link href="/auth/register-user" className="text-indigo-400 hover:underline">
                Cadastre-se
              </Link>
            </p>
            <p className="text-white/50 text-sm mt-2">
              Esqueceu sua senha?{' '}
              <Link href="/auth/forgot-password" className="text-indigo-400 hover:underline">
                Recuperar
              </Link>
            </p>
          </div>
        </div>

        <footer className="text-center mt-6">
          <p className="text-xs text-white/40">
            © 2025 Redirex Solutions. Todos os direitos reservados.
          </p>
          <nav className="flex justify-center gap-4 mt-3">
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