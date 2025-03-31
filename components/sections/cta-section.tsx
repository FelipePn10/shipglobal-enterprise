"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function CtaSection() {
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
    <section className="relative py-24 overflow-hidden bg-[#040404]">
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 md:p-12 backdrop-blur-[2px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />

          <div className="relative z-10">
            <motion.div
              custom={0}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                  Ready to Access Products from Around the World?
                </span>
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have expanded their shopping horizons with our international
                product redirection services.
              </p>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-medium px-6 py-3 flex items-center">
              Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" className="border border-white/20 text-gray-400 bg-black/30 p-4 rounded-lg hover:bg-white/10 hover:text-white transition-colors duration-300">
              Learn More About Our Process
            </Button>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className={cn("text-xl text-white/60", pacifico.className)}>
                "Unlocking global products, delivered to your doorstep"
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

