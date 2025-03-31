"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
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

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-16 overflow-hidden bg-[#020202]">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Image src="https://kokonutui.com/logo.svg" alt="ShipGlobal Solutions" width={30} height={30} />
              <span className="text-xl font-bold text-white">ShipGlobal</span>
            </div>
            <p className="text-white/60 mb-6">
              Breaking down international barriers to connect you with products from around the world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/40 hover:text-white/80 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-white/80 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-white/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-white/80 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/personal-shopping"
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  Personal Shopping
                </Link>
              </li>
              <li>
                <Link
                  href="/services/business-importing"
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  Business Importing
                </Link>
              </li>
              <li>
                <Link href="/services/specialty-items" className="text-white/60 hover:text-white/90 transition-colors">
                  Specialty Items
                </Link>
              </li>
              <li>
                <Link
                  href="/services/concierge-service"
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  Concierge Service
                </Link>
              </li>
              <li>
                <Link
                  href="/services/customs-clearance"
                  className="text-white/60 hover:text-white/90 transition-colors"
                >
                  Customs Clearance
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/60 hover:text-white/90 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-white/60 hover:text-white/90 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/60 hover:text-white/90 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/60 hover:text-white/90 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/60 hover:text-white/90 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-white/90 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-white/40 mt-0.5" />
                <span className="text-white/60">support@globalreach.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-white/40 mt-0.5" />
                <span className="text-white/60">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/40 mt-0.5" />
                <span className="text-white/60">
                  123 Global Plaza, Suite 400
                  <br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          custom={4}
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10 text-center text-white/40 text-sm"
        >
          <p>© {currentYear} ShipGlobal Solutions. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white/60 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

