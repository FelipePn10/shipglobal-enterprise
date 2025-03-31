"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Truck, CreditCard, CheckCircle, ShoppingBag, Search, Camera, Shield } from "lucide-react"
import PageHeader from "@/components/layouts/page-header"
import FAQAccordion from "@/components/services/faq-accordion"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function HowItWorksPage() {
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
      icon: <ShoppingBag className="w-10 h-10 text-indigo-400" />,
      title: "Shop Anywhere",
      description:
        "Browse and purchase products from international retailers that don't ship to your location. Use our address in the retailer's country as your shipping destination.",
      details: [
        "Shop on any website worldwide",
        "Use our local address at checkout",
        "Pay the retailer directly as normal",
        "We'll notify you when your package arrives",
      ],
    },
    {
      icon: <Package className="w-10 h-10 text-violet-400" />,
      title: "We Receive Your Package",
      description:
        "We receive your package at our local facility, inspect it for damage, and prepare it for international shipping to your location.",
      details: [
        "Package arrival notification",
        "Optional photo verification",
        "Condition inspection",
        "Secure storage until shipping",
      ],
    },
    {
      icon: <CreditCard className="w-10 h-10 text-rose-400" />,
      title: "Choose Shipping Options",
      description:
        "Select your preferred shipping method, insurance coverage, and any additional services like package consolidation or repackaging.",
      details: [
        "Multiple shipping speed options",
        "Package consolidation available",
        "Insurance coverage options",
        "Special handling for fragile items",
      ],
    },
    {
      icon: <Truck className="w-10 h-10 text-amber-400" />,
      title: "International Shipping",
      description:
        "We handle all customs documentation and international shipping logistics to ensure your package arrives safely at your door.",
      details: [
        "Customs documentation preparation",
        "Duty and tax calculation",
        "Real-time tracking",
        "Delivery to your address",
      ],
    },
  ]

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Address Lookup",
      description:
        "Get your personal shopping address in multiple countries to use when checking out at international retailers.",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Package Consolidation",
      description: "Combine multiple packages into a single shipment to save on international shipping costs.",
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Photo Verification",
      description: "Request photos of your items before they're shipped to ensure they meet your expectations.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Insurance Options",
      description: "Protect your valuable purchases with our comprehensive shipping insurance options.",
    },
  ]

  const faqs = [
    {
      question: "How long does international shipping take?",
      answer:
        "Shipping times vary depending on the origin, destination, and shipping method selected. Standard shipping typically takes 7-14 business days, while expedited options can deliver in 3-5 business days. You'll receive detailed time estimates when selecting your shipping options.",
    },
    {
      question: "How do I track my package?",
      answer:
        "Once your package is shipped, you'll receive a tracking number and link via email. You can also log into your account dashboard to track all your shipments in real-time, with detailed status updates throughout the delivery process.",
    },
    {
      question: "What about customs duties and taxes?",
      answer:
        "Import duties and taxes are determined by your country's customs authorities and are typically based on the value and type of items. We provide estimated duty and tax calculations before shipping, and you can choose to pre-pay these fees or pay upon delivery, depending on the destination country.",
    },
    {
      question: "Can I consolidate multiple packages?",
      answer:
        "Yes! Our package consolidation service allows you to combine multiple packages into a single shipment, potentially saving significant costs on international shipping. We'll hold your packages for up to 30 days at no extra charge while waiting for all items to arrive.",
    },
    {
      question: "What items are prohibited?",
      answer:
        "Prohibited items vary by country but generally include perishables, hazardous materials, weapons, and counterfeit goods. We provide a comprehensive list of prohibited items for each destination country, and our team can help determine if your items are eligible for shipping.",
    },
    {
      question: "What happens if my package is lost or damaged?",
      answer:
        "We offer shipping insurance options to protect against loss or damage. If you've purchased insurance and your package is lost or damaged during transit, we'll process your claim quickly and provide appropriate compensation based on the declared value.",
    },
  ]

  return (
    <main className="bg-[#030303] text-white">
      <PageHeader title="How It Works" subtitle="Your step-by-step guide to shopping globally with ease" />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                The Process Explained
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              Our international product redirection service makes it simple to access products from anywhere in the
              world. Follow these four easy steps to get started.
            </p>
          </motion.div>

          <div className="grid gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div className={cn(index % 2 === 1 && "md:order-2")}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.08]">{step.icon}</div>
                    <div className="text-4xl font-bold text-white/10">0{index + 1}</div>
                  </div>

                  <h3 className="text-2xl font-semibold mb-4 text-white/90">{step.title}</h3>
                  <p className="text-white/70 mb-6">{step.description}</p>

                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/70">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={cn(
                    "bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden",
                    index % 2 === 1 && "md:order-1",
                  )}
                >
                  <Image
                    src={`/placeholder.svg?height=400&width=600&text=Step ${index + 1}`}
                    alt={`Step ${index + 1}: ${step.title}`}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Key Features
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              Our platform offers several features designed to make international shopping convenient and worry-free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
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
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              custom={0}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                  Our Technology Platform
                </span>
              </h2>

              <p className="text-white/70 mb-6 leading-relaxed">
                Our advanced technology platform makes international shopping as easy as local purchasing. From our
                user-friendly dashboard to our real-time tracking system, we've designed every aspect of our service to
                provide a seamless experience.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white/90 font-medium">User-Friendly Dashboard</span>
                    <p className="text-white/70 text-sm mt-1">
                      Manage all your shipments, addresses, and preferences in one place
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white/90 font-medium">Real-Time Tracking</span>
                    <p className="text-white/70 text-sm mt-1">
                      Follow your package's journey with detailed status updates
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white/90 font-medium">Shipping Calculator</span>
                    <p className="text-white/70 text-sm mt-1">
                      Get accurate shipping cost estimates before making purchases
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white/90 font-medium">Mobile App</span>
                    <p className="text-white/70 text-sm mt-1">
                      Manage your shipments on the go with our mobile application
                    </p>
                  </div>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                  Try Our Platform <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=Dashboard Preview"
                  alt="Platform dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Frequently Asked Questions
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              Find answers to common questions about our international shipping process.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <FAQAccordion items={faqs} />
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
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
                    Ready to Shop Globally?
                  </span>
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Create your account today and get your personal shopping address to start accessing products from
                  around the world.
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
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-medium px-6 py-3">
                    Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="border-white/10 hover:bg-white/[0.03] text-white/80">
                    View Pricing
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

