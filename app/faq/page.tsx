"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Truck, CreditCard, Shield, Globe, DollarSign } from "lucide-react"
import PageHeader from "@/components/layouts/page-header"
import FAQAccordion from "@/components/services/faq-accordion"

export default function FAQPage() {
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

  const categories = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "General Questions",
      faqs: [
        {
          question: "What is Redirex Solutions?",
          answer:
            "Redirex Solutions is an international product redirection service that helps individuals and businesses access products from retailers worldwide that don't offer direct international shipping. We provide you with local addresses in multiple countries, receive your packages, and forward them to your location anywhere in the world.",
        },
        {
          question: "Which countries do you operate in?",
          answer:
            "We currently have warehouses and provide shipping addresses in the United States, United Kingdom, Germany, Japan, Australia, Singapore, and Hong Kong. We can ship packages to virtually any country worldwide, subject to shipping carrier availability and local import regulations.",
        },
        {
          question: "How do I get started?",
          answer:
            "Getting started is easy! Simply create an account on our website, select your preferred plan, and you'll immediately receive your personal shopping addresses. You can then use these addresses when shopping at international retailers, and we'll handle the rest of the process.",
        },
        {
          question: "Is there a mobile app available?",
          answer:
            "Yes, we offer mobile apps for both iOS and Android devices. Our apps allow you to manage your shipments, track packages, and receive notifications on the go. You can download them from the Apple App Store or Google Play Store.",
        },
      ],
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Shipping & Delivery",
      faqs: [
        {
          question: "How long does shipping take?",
          answer:
            "Shipping times vary depending on the origin, destination, and shipping method selected. Standard shipping typically takes 7-14 business days, while expedited options can deliver in 3-5 business days. You'll receive detailed time estimates when selecting your shipping options.",
        },
        {
          question: "Can I track my package?",
          answer:
            "Yes, all shipments include tracking information. You can monitor your package's journey through our website or mobile app, with real-time updates at each stage of the shipping process.",
        },
        {
          question: "What shipping carriers do you use?",
          answer:
            "We partner with major international carriers including DHL, FedEx, UPS, and local postal services. The specific carrier options available will depend on your package's origin and destination, and you can choose from multiple options when arranging shipping.",
        },
        {
          question: "Do you offer insurance for packages?",
          answer:
            "Yes, we offer shipping insurance to protect against loss or damage during transit. Insurance is optional and priced at 3% of the declared value. Some premium plans include complimentary insurance coverage up to a certain value.",
        },
      ],
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Costs & Billing",
      faqs: [
        {
          question: "How much does the service cost?",
          answer:
            "Our service operates on a subscription model with plans starting at $9.99 per month for personal use and $49.99 for business accounts. Each plan includes different features and benefits. Shipping costs are calculated separately based on package dimensions, weight, and destination.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "We pride ourselves on transparency. Your subscription covers the features listed in your plan. Additional services like extra storage or special handling are clearly priced. Import duties and taxes are determined by customs authorities and are not included in our fees.",
        },
        {
          question: "How are shipping costs calculated?",
          answer:
            "Shipping costs are based on the dimensional weight of your package (the greater of actual weight or volume-based weight), the destination country, and your chosen shipping method. You can use our shipping calculator to estimate costs before making purchases.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for business accounts. All payments are processed securely through our payment partners.",
        },
      ],
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Account & Services",
      faqs: [
        {
          question: "Can I consolidate multiple packages?",
          answer:
            "Yes! Our package consolidation service allows you to combine multiple packages into a single shipment, potentially saving significant costs on international shipping. We'll hold your packages for up to 30 days at no extra charge while waiting for all items to arrive.",
        },
        {
          question: "What is photo verification?",
          answer:
            "Photo verification is a service where we take photos of your items when they arrive at our warehouse. This allows you to verify the condition and contents of your packages before they're shipped internationally. The number of photos included depends on your subscription plan.",
        },
        {
          question: "How long can you store my packages?",
          answer:
            "Storage duration varies by plan: Basic plans include 30 days of free storage, Premium plans include 60 days, and Elite plans include 90 days. Beyond these periods, additional storage fees apply at $0.50 per package per day.",
        },
        {
          question: "Can I cancel my subscription?",
          answer:
            "Yes, you can cancel your subscription at any time through your account dashboard. Your subscription will remain active until the end of the current billing period, after which it will not renew.",
        },
      ],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Customs & Regulations",
      faqs: [
        {
          question: "How are customs duties and taxes handled?",
          answer:
            "Import duties and taxes are determined by your country's customs authorities and are typically based on the value and type of items. We provide estimated duty and tax calculations before shipping, and you can choose to pre-pay these fees or pay upon delivery, depending on the destination country.",
        },
        {
          question: "What items are prohibited?",
          answer:
            "Prohibited items vary by country but generally include perishables, hazardous materials, weapons, and counterfeit goods. We provide a comprehensive list of prohibited items for each destination country, and our team can help determine if your items are eligible for shipping.",
        },
        {
          question: "Do you provide customs documentation?",
          answer:
            "Yes, we prepare all necessary customs documentation for your international shipments. For business customers on higher-tier plans, we offer additional customs clearance assistance and documentation services.",
        },
        {
          question: "Can you ship restricted items?",
          answer:
            "Some restricted items may be shipped with proper documentation and permits. Please contact our customer service team before purchasing restricted items to confirm if we can ship them to your destination country and what additional documentation may be required.",
        },
      ],
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Business Services",
      faqs: [
        {
          question: "What special services do you offer for businesses?",
          answer:
            "Our business plans include features like bulk shipping discounts, inventory management, customs documentation assistance, dedicated account managers, and API integration options. We also offer customized solutions for enterprises with high-volume shipping needs.",
        },
        {
          question: "Can you help with sourcing products?",
          answer:
            "Yes, our concierge service can assist with product sourcing for business clients. This includes identifying suppliers, negotiating prices, and managing the purchasing process on your behalf. This service is available with our Business Pro plan or as an add-on service.",
        },
        {
          question: "Do you offer API integration?",
          answer:
            "Yes, we provide API integration for business customers on our Enterprise plan. This allows you to integrate our shipping and logistics services directly into your e-commerce platform, inventory management system, or custom applications.",
        },
        {
          question: "Can you handle regular shipments for my business?",
          answer:
            "Our business plans are designed for regular importers. We can establish a streamlined process for recurring shipments, including scheduled pickups, consistent documentation, and predictable delivery timelines.",
        },
      ],
    },
  ]

  return (
    <main className="bg-[#030303] text-white">
      <PageHeader title="Frequently Asked Questions" subtitle="Find answers to common questions about our services" />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-16">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                    {category.title}
                  </h2>
                </div>

                <div className="max-w-3xl">
                  <FAQAccordion items={category.faqs} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white/[0.01]">
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
                    Still Have Questions?
                  </span>
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Our support team is ready to help with any additional questions you may have about our services.
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
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-medium px-6 py-3">
                    Contact Support <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" className="border-white/10 hover:bg-white/[0.03] text-white/80">
                    Learn How It Works
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

