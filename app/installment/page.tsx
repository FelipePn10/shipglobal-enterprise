"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  CreditCard,
  Calendar,
  Shield,
  Calculator,
  CheckCircle,
  ArrowRight,
  Percent,
  Clock,
  DollarSign,
  Gift,
  Zap,
  TrendingUp,
} from "lucide-react";

// // Componente de animação de números contadores
// const AnimatedCounter = ({ end, duration = 2, prefix = "", suffix = "" }) => {
//   const [count, setCount] = useState(0);
//   const ref = React.useRef();
//   const inView = useInView(ref);

//   useEffect(() => {
//     if (inView) {
//       let startTime;
//       const animate = (timestamp) => {
//         if (!startTime) startTime = timestamp;
//         const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

//         setCount(Math.floor(progress * end));

//         if (progress < 1) {
//           requestAnimationFrame(animate);
//         }
//       };
//       requestAnimationFrame(animate);
//     }
//   }, [inView, end, duration]);

//   return (
//     <span ref={ref} className="font-bold text-white">
//       {prefix}{count.toLocaleString()}{suffix}
//     </span>
//   );
// };

// Componente de cartão de crédito 3D
const CreditCard3D = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-80 h-48 mx-auto"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 rounded-2xl shadow-2xl"
        animate={{
          rotateY: isHovered ? 15 : 0,
          rotateX: isHovered ? -10 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-black/20 rounded-2xl" />

        {/* Chip do cartão */}
        <div className="absolute top-6 left-6 w-12 h-8 bg-gradient-to-br from-amber-300 to-amber-500 rounded-md" />

        {/* Número do cartão */}
        <div className="absolute bottom-16 left-6 right-6">
          <div className="text-white text-lg font-mono tracking-wider">
            •••• •••• •••• 1234
          </div>
        </div>

        {/* Nome e validade */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between text-white text-sm">
          <div>SEU NOME</div>
          <div>12/28</div>
        </div>

        {/* Detalhes em 12x */}
        <div className="absolute top-6 right-6 text-white text-right">
          <div className="text-sm font-medium">Parcele em</div>
          <div className="text-2xl font-bold">12x</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente de calculadora interativa
const InstallmentCalculator = () => {
  const [value, setValue] = useState(1000);
  const [installments, setInstallments] = useState(12);

  const calculateInstallment = () => {
    return (value / installments).toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg">
          <Calculator className="h-6 w-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          Calculadora de Parcelas
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Valor da Compra (R$)
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(236 72 153) 100%)`,
            }}
          />
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-white">
              R$ {value.toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Número de Parcelas
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 6, 9, 12].map((num) => (
              <button
                key={num}
                onClick={() => setInstallments(num)}
                className={`p-2 rounded-lg font-medium transition-all ${
                  installments === num
                    ? "bg-gradient-to-r from-indigo-500 to-rose-500 text-white"
                    : "bg-white/[0.05] text-white/70 hover:bg-white/[0.08]"
                }`}
              >
                {num}x
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={`${value}-${installments}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-indigo-500/10 to-rose-500/10 rounded-xl p-4 text-center border border-white/[0.08]"
        >
          <div className="text-sm text-white/70 mb-1">Valor da parcela</div>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
            R$ {calculateInstallment()}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {installments}x sem juros
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Componente principal da página
export default function InstallmentPage() {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  const benefits = [
    {
      icon: <Percent className="h-8 w-8 text-emerald-400" />,
      title: "0% de Juros",
      description: "Parcele suas compras em até 12x sem juros adicionais",
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-400" />,
      title: "Aprovação Instantânea",
      description: "Processo automatizado e aprovação em segundos",
      color: "from-blue-500/20 to-indigo-500/20",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-400" />,
      title: "100% Seguro",
      description: "Suas informações protegidas com criptografia bancária",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <Gift className="h-8 w-8 text-amber-400" />,
      title: "Sem Taxa de Adesão",
      description: "Nenhuma taxa adicional para usar o parcelamento",
      color: "from-amber-500/20 to-orange-500/20",
    },
  ];

  return (
    <div className="bg-[#030303] text-white min-h-screen">
      {/* Header da página */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-8"
          >
            <h1 className="mb-6 text-3xl font-bold md:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Parcelamento sem Juros
              </span>
            </h1>
            <div className="mx-auto mb-8 h-1 w-20 bg-gradient-to-r from-indigo-500 to-rose-500" />
            <p className="leading-relaxed text-white/70 max-w-3xl mx-auto">
              Agora você pode importar produtos diretamente da China e pagar
              parcelado em até 12x sem juros
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              custom={0}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-rose-500/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-8"
              >
                <Zap className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-300">
                  Novidade: Parcelamento sem juros
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-white">Parcele suas compras em até</span>
                <br />
                <motion.span
                  className="inline-block text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  12x
                </motion.span>
                <span className="text-white ml-4">sem juros</span>
              </h2>

              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Importe produtos diretamente da China com facilidade de
                pagamento e toda a segurança que você merece.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-500 to-rose-500 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-rose-600 transition-all text-white"
                >
                  Começar Agora <ArrowRight className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/[0.05] transition-all text-white"
                >
                  Ver Como Funciona
                </motion.button>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {/* <AnimatedCounter end={50000} suffix="+" /> */}
                  </div>
                  <div className="text-sm text-white/60">Clientes Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {/* <AnimatedCounter end={98} suffix="%" /> */}
                  </div>
                  <div className="text-sm text-white/60">Satisfação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {/* <AnimatedCounter end={24} suffix="h" /> */}
                  </div>
                  <div className="text-sm text-white/60">Suporte</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <CreditCard3D />

              {/* Elementos flutuantes */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -left-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-2xl"
              >
                <CheckCircle className="h-6 w-6 text-white" />
                <div className="text-xs text-white mt-1 font-medium">
                  Aprovado
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -right-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 shadow-2xl"
              >
                <DollarSign className="h-6 w-6 text-white" />
                <div className="text-xs text-white mt-1 font-medium">
                  Sem Juros
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Vantagens do Nosso Parcelamento
              </span>
            </h2>
            <div className="mx-auto mb-8 h-1 w-20 bg-gradient-to-r from-indigo-500 to-rose-500" />
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Oferecemos as melhores condições do mercado para suas compras
              internacionais
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                custom={index + 1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} mb-6`}
                >
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>

                <p className="text-white/70 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              custom={0}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                  Simule suas parcelas
                </span>
              </h2>

              <p className="text-xl text-white/70 mb-8">
                Use nossa calculadora interativa para descobrir quanto você
                pagará por mês nas suas compras importadas da China.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80">
                    Parcelamento em até 12x sem juros
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80">
                    Aprovação automática para valores até R$ 5.000
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80">
                    Primeira parcela em 30 dias
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80">
                    Sem consulta ao SPC/SERASA
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <InstallmentCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.1),transparent_70%)]" />

            <div className="relative z-10 p-8 md:p-12 text-center">
              <motion.div
                custom={0}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                    Pronto para começar?
                  </span>
                </h2>

                <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                  Crie sua conta agora e tenha acesso ao parcelamento em até 12x
                  sem juros para todas suas compras da China.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-indigo-500 to-rose-500 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-rose-600 transition-all text-lg text-white"
                  >
                    Criar Conta Grátis <ArrowRight className="h-5 w-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/[0.05] transition-all text-lg text-white"
                  >
                    Falar com Consultor
                  </motion.button>
                </div>

                <div className="flex items-center justify-center gap-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm text-white/70">100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-white/70">
                      Aprovação Instantânea
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-rose-400" />
                    <span className="text-sm text-white/70">Sem Juros</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
