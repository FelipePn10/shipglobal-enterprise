"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function ExpertiseSection() {
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

  const expertisePoints = [
    "10+ years of international logistics experience",
    "Network of warehouses in 15+ countries",
    "Partnerships with major shipping carriers worldwide",
    "Customs clearance specialists on staff",
    "Advanced package tracking technology",
    "Multilingual customer support team",
  ]

  const stats = [
    { value: "500K+", label: "Packages Delivered" },
    { value: "150+", label: "Countries Served" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "24/7", label: "Support Available" },
  ]

  return (
    <section className="relative py-24 overflow-hidden bg-[#040404]">
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Why Choose Us
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mb-6" />

            <h3 className={cn("text-2xl mb-6 text-white/90", pacifico.className)}>
              Unmatched Expertise in Global Logistics
            </h3>

            <p className="text-white/70 mb-8 leading-relaxed">
              With over a decade of experience in international shipping and product redirection, our team has developed
              the expertise and infrastructure to handle any global logistics challenge.
            </p>

            <ul className="space-y-3 mb-8">
              {expertisePoints.map((point, index) => (
                <motion.li
                  key={index}
                  custom={index + 2}
                  variants={fadeInVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index + 7}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={cn(
                  "bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 text-center",
                  "backdrop-blur-[2px]",
                  "after:absolute after:inset-0 after:rounded-xl",
                  "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]",
                  "after:pointer-events-none",
                  "relative",
                )}
              >
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

