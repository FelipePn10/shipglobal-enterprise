"use client"

import { motion } from "framer-motion"
import { Globe, Shield, Clock, DollarSign, Zap, HeartHandshake } from "lucide-react"

export default function BenefitsSection() {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Shop from retailers worldwide that don't offer international shipping to your location.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Handling",
      description: "Your packages are handled with care and fully insured throughout the entire shipping process.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Efficiency",
      description: "Save time with our streamlined process that handles customs clearance and international logistics.",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Cost Savings",
      description: "Benefit from our bulk shipping rates and avoid excessive international shipping fees.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Simplified Process",
      description: "Our user-friendly platform makes international shopping as easy as local purchasing.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Personalized Support",
      description: "Receive dedicated customer service from our team of international shipping experts.",
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          custom={0}
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Benefits of Our Services
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-6" />
          <p className="text-white/70 leading-relaxed">
            Our international product redirection services offer numerous advantages that make global shopping
            accessible, affordable, and hassle-free.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              custom={index + 1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.05] transition-colors duration-300"
            >
              <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg inline-flex mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white/90">{benefit.title}</h3>
              <p className="text-white/70">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

