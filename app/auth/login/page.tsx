"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [animateBackground, setAnimateBackground] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateBackground(prev => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulação de validação visual
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Credenciais inválidas ou conta não aprovada");
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard"; 
      }, 1500);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  // Animação para os elementos de fundo
  const backgroundVariants = {
    gradient1: { 
      backgroundPosition: ["0% 0%", "100% 100%"], 
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" } 
    },
    gradient2: { 
      backgroundPosition: ["100% 0%", "0% 100%"], 
      transition: { duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" } 
    },
    gradient3: { 
      scale: [1, 1.1, 1], 
      transition: { duration: 8, repeat: Infinity } 
    }
  };

  const floatingShapeVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Fundos animados */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-500/5 to-rose-500/10 blur-3xl"
        animate={animateBackground === 0 ? "gradient1" : (animateBackground === 1 ? "gradient2" : "gradient3")}
        variants={backgroundVariants}
      />
      
      {/* Formas flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate="animate"
          variants={floatingShapeVariants}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-2xl top-16 -left-20" 
        />
        <motion.div 
          animate="animate"
          variants={floatingShapeVariants}
          initial={{ y: 20 }}
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-300/10 blur-2xl bottom-32 -right-20" 
        />
        <motion.div 
          animate="animate"
          variants={floatingShapeVariants}
          initial={{ y: -30 }}
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-rose-500/10 to-pink-500/10 blur-2xl top-1/2 left-1/2" 
        />
      </div>

      {/* Painel de login */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <motion.div 
          className="bg-white/[0.05] backdrop-blur-lg border border-white/[0.08] rounded-2xl p-8 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Efeito de luz nos cantos */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
          
          <motion.div custom={0} variants={fadeInVariants} initial="hidden" animate="visible" className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <motion.div 
                whileHover={{ rotate: 360 }} 
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative w-10 h-10 flex items-center justify-center"
              >
                <Image src="https://kokonutui.com/logo.svg" alt="ShipGlobal Solutions" width={30} height={30} className="z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">ShipGlobal</span>
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-2">Login Empresarial</h1>
            <p className="text-white/60">Acesse sua conta empresarial</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-rose-400 text-center p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-lg"
              >
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-white mb-2">Login bem-sucedido!</h3>
                  <p className="text-white/60 text-center">Redirecionando para seu dashboard...</p>
                </motion.div>
              ) : (
                <>
                  <motion.div custom={1} variants={fadeInVariants} initial="hidden" animate="visible" className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`transition-colors duration-200 ${focusedField === 'email' ? 'text-indigo-400' : 'text-white/80'}`}>Email Corporativo</Label>
                      <div className="relative group">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === 'email' ? 'text-indigo-400' : 'text-white/40'}`} />
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="contato@empresa.com" 
                          className="pl-10 bg-white/[0.03] border-white/[0.08] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200" 
                        />
                        <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className={`transition-colors duration-200 ${focusedField === 'password' ? 'text-indigo-400' : 'text-white/80'}`}>Senha</Label>
                      <div className="relative group">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === 'password' ? 'text-indigo-400' : 'text-white/40'}`} />
                        <Input 
                          id="password" 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••" 
                          className="pl-10 bg-white/[0.03] border-white/[0.08] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200" 
                        />
                        <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300 ${focusedField === 'password' ? 'w-full' : 'w-0'}`} />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div custom={2} variants={fadeInVariants} initial="hidden" animate="visible">
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full group relative overflow-hidden border-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-rose-600 transition-all duration-300 group-hover:scale-110" />
                      <div className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Entrando...</span>
                          </>
                        ) : (
                          <>
                            <span>Entrar</span>
                            <motion.div
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          </>
                        )}
                      </div>
                    </Button>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-6 text-center text-white/60 text-sm"
                    >
                      Esqueceu sua senha?{" "}
                      <Link href="/auth/forgot-password" className="text-indigo-400 relative inline-block group">
                        Recuperar
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </motion.p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Rodapé */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-white/40 text-xs"
        >
          <p>© {new Date().getFullYear()} ShipGlobal Solutions. Todos os direitos reservados.</p>
        </motion.div>
      </div>
    </div>
  );
}