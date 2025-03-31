"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"
import { Package, ShoppingBag, Briefcase, Users } from "lucide-react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function ServicesSection() {
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

  const services = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Personal Shopping",
      description:
        "Our service allows individuals to shop from international retailers that don't ship to their country, with packages forwarded to their doorstep.",
      features: ["Personal shipping address", "Package consolidation", "Photo verification", "Repackaging options"],
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Business Importing",
      description:
        "Streamline your business's international procurement with our specialized B2B import services designed for regular shipments.",
      features: [
        "Bulk shipping discounts",
        "Inventory management",
        "Customs documentation",
        "Dedicated account manager",
      ],
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Specialty Items",
      description:
        "Specialized handling for high-value, fragile, or oversized items that require extra care during international transit.",
      features: ["Extra protective packaging", "Insurance options", "White glove delivery", "Real-time tracking"],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Concierge Service",
      description:
        "Premium service where our team handles the entire process from purchase to delivery, ideal for busy professionals.",
      features: ["Product sourcing", "Purchase assistance", "Quality inspection", "Priority shipping"],
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
              Our Services
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-6" />
          <p className="text-white/70 leading-relaxed">
            We offer a range of international product redirection services tailored to meet the needs of individuals and
            businesses alike.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              custom={index + 1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={cn(
                "bg-white/[0.03] border border-white/[0.08] rounded-xl p-8",
                "backdrop-blur-[2px]",
                "after:absolute after:inset-0 after:rounded-xl",
                "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]",
                "after:pointer-events-none",
                "relative",
              )}
            >
              <div className="relative z-10">
                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg inline-flex mb-4">
                  {service.icon}
                </div>

                <h3 className={cn("text-2xl mb-3 text-white/90", pacifico.className)}>{service.title}</h3>

                <p className="text-white/70 mb-6">{service.description}</p>

                <h4 className="text-sm uppercase tracking-wider text-white/40 mb-3">Features</h4>

                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-rose-400"></span>
                      <span className="text-white/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

