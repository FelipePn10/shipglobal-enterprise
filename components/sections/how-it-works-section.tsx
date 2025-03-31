"use client"

import { motion } from "framer-motion"
import { ArrowRight, Package, Truck, CreditCard, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HowItWorksSection() {
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

  const steps = [
    {
      icon: <Package className="w-10 h-10 text-indigo-400" />,
      title: "Shop Anywhere",
      description: "Browse and purchase products from international retailers that don't ship to your location.",
    },
    {
      icon: <Truck className="w-10 h-10 text-violet-400" />,
      title: "Ship to Our Address",
      description: "Use our local address in the retailer's country as your shipping destination.",
    },
    {
      icon: <CreditCard className="w-10 h-10 text-rose-400" />,
      title: "We Process Your Package",
      description: "We receive, inspect, and prepare your items for international shipping to your location.",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-amber-400" />,
      title: "Receive at Your Door",
      description: "Your products are delivered directly to your address, no matter where you are in the world.",
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden bg-[#040404]">
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

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
              How Our Service Works
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-6" />
          <p className="text-white/70 leading-relaxed">
            Our international product redirection service makes it simple to access products from anywhere in the world.
            Follow these four easy steps to get started.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index + 1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={cn(
                "relative bg-white/[0.03] border border-white/[0.08] rounded-xl p-6",
                "backdrop-blur-[2px]",
                "after:absolute after:inset-0 after:rounded-xl",
                "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]",
                "after:pointer-events-none",
              )}
            >
              <div className="relative z-10">
                <div className="mb-4 flex justify-between items-center">
                  <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.08]">{step.icon}</div>
                  <div className="text-4xl font-bold text-white/10">0{index + 1}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-white/20" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

