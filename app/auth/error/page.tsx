"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  AlertCircle,
  ChevronLeft,
  Info,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ElegantShape from "@/components/kokonutui/elegant-shape";

// Animation Variants
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code") || "unknown";
  const errorMessages = {
    "invalid-credentials": "Email ou senha incorretos. Por favor, verifique suas credenciais.",
    "account-locked": "Sua conta foi bloqueada temporariamente após múltiplas tentativas de login.",
    "verification-required": "Por favor, verifique seu email para confirmar sua conta antes de fazer login.",
    "session-expired": "Sua sessão expirou. Por favor, faça login novamente.",
    "unknown": "Ocorreu um erro inesperado. Por favor, tente novamente.",
  };

  const errorMessage = errorMessages[errorCode as keyof typeof errorMessages] || errorMessages.unknown;

  const handleRetry = () => {
    window.location.href = "/auth/login";
  };

  return (
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
        </motion.header>

        <motion.div
          variants={fadeInVariants}
          custom={1}
          initial="hidden"
          animate="visible"
          className="space-y-6 my-6"
        >
          <div className="text-center mb-6">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-pulse"></div>
              <AlertCircle className="h-12 w-12 text-rose-400 relative z-10" />
            </div>
            <h2 className="text-xl font-bold text-white">Falha no Login</h2>
            <p className="text-white/70 mt-2">{errorMessage}</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <p className="text-sm text-white/80">
                Se você esqueceu sua senha, use a opção &ldquo;Esqueci minha senha&rdquo; na página de login.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleRetry}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-rose-500 hover:opacity-90 transition-all duration-200 font-medium"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>

            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Home
              </Button>
            </Link>
          </div>

          <div className="pt-4">
            <div className="text-center">
              <p className="text-white/50 text-sm">
                Não tem uma conta?{" "}
                <Link
                  href="/auth/register"
                  className="text-indigo-400 hover:underline"
                >
                  Registre-se
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-indigo-400 hover:underline text-sm"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="text-center mt-6">
        <p className="text-xs text-white/40">
          © 2025 Redirex Solutions. Todos os direitos reservados.
        </p>
        <nav className="flex justify-center gap-4 mt-3" aria-label="Footer links">
          <Link href="/terms" className="text-xs text-white/60 hover:text-white/90">
            Termos
          </Link>
          <Link
            href="/privacy"
            className="text-xs text-white/60 hover:text-white/90"
          >
            Privacidade
          </Link>
          <Link
            href="/contact"
            className="text-xs text-white/60 hover:text-white/90"
          >
            Contato
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default function LoginErrorPage() {
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
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}