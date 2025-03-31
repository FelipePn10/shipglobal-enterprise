"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function AboutSection() {
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

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                About Us
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-white/90">Our Story</h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                Founded in 2015, ShipGlobal Solutions emerged from a simple vision: to break down international
                barriers that prevent consumers and businesses from accessing products worldwide. What began as a small
                operation has grown into a trusted partner for thousands of clients seeking global product access.
              </p>
              <p className="text-white/70 leading-relaxed">
                Today, we leverage advanced logistics networks, cutting-edge technology, and deep market expertise to
                connect our clients with products from anywhere in the world, regardless of geographic restrictions.
              </p>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                <h4
                  className={cn(
                    "text-xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-white",
                    pacifico.className,
                  )}
                >
                  Our Mission
                </h4>
                <p className="text-white/70">
                  To empower individuals and businesses by providing seamless access to global products, eliminating
                  geographical limitations through innovative redirection solutions.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                <h4
                  className={cn(
                    "text-xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-rose-300",
                    pacifico.className,
                  )}
                >
                  Our Values
                </h4>
                <ul className="text-white/70 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Transparency in every transaction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Reliability you can count on</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                    <span>Innovation that breaks barriers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Customer satisfaction above all</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

