"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pacifico } from "next/font/google"
import { cn } from "@/lib/utils"
import { CheckIcon, XIcon, ChevronDownIcon, BadgeCheckIcon, ShieldCheckIcon } from "lucide-react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

// Types
interface Company {
  name: string
  isOurs: boolean
  tagline: string
  accentColor: string
}

interface CompanyFeature {
  hasFeature: boolean
  details: string
}

interface Feature {
  name: string
  description: string
  companies: CompanyFeature[]
}

// Data
const companies: Company[] = [
  {
    name: "Redirex",
    isOurs: true,
    tagline: "Premium Global Service",
    accentColor: "from-indigo-300 to-rose-300",
  },
  {
    name: "Competitor A",
    isOurs: false,
    tagline: "Standard Shipping",
    accentColor: "from-slate-400 to-slate-500",
  },
  {
    name: "Competitor B",
    isOurs: false,
    tagline: "Budget Forwarding",
    accentColor: "from-slate-400 to-slate-500",
  },
  {
    name: "Competitor C",
    isOurs: false,
    tagline: "Regional Provider",
    accentColor: "from-slate-400 to-slate-500",
  },
]

const features: Feature[] = [
  {
    name: "Global Forwarding",
    description: "Ship your packages to any country with customs handling and optimal routing.",
    companies: [
      { hasFeature: true, details: "200+ countries with premium service" },
      { hasFeature: true, details: "Limited to 65 countries" },
      { hasFeature: false, details: "Not available" },
      { hasFeature: true, details: "75 countries with basic service" },
    ],
  },
  {
    name: "Package Consolidation",
    description: "Combine multiple packages into one shipment to save on shipping costs.",
    companies: [
      { hasFeature: true, details: "Unlimited items with smart packaging" },
      { hasFeature: false, details: "Not available" },
      { hasFeature: true, details: "Limited to 5 items per package" },
      { hasFeature: false, details: "Not available" },
    ],
  },
  {
    name: "Tax Optimization",
    description: "Smart customs declarations and routing to minimize import taxes and duties.",
    companies: [
      { hasFeature: true, details: "Advanced AI-powered optimization" },
      { hasFeature: false, details: "Not available" },
      { hasFeature: false, details: "Not available" },
      { hasFeature: false, details: "Not available" },
    ],
  },
  {
    name: "24/7 Support",
    description: "Round-the-clock customer support for all your shipping questions and concerns.",
    companies: [
      { hasFeature: true, details: "Premium support with dedicated agent" },
      { hasFeature: false, details: "Limited business hours only" },
      { hasFeature: false, details: "Email only" },
      { hasFeature: true, details: "Basic 24/7 support" },
    ],
  },
  {
    name: "Digital Tracking",
    description: "Real-time tracking of your packages from origin to destination.",
    companies: [
      { hasFeature: true, details: "Real-time with predictive delivery" },
      { hasFeature: true, details: "Basic tracking updates" },
      { hasFeature: true, details: "Limited updates" },
      { hasFeature: false, details: "Not available" },
    ],
  },
]

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

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

const premiumVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

const detailsVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 16,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

export default function RefinedServiceComparisonTable() {
  // State
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [hoveredCompany, setHoveredCompany] = useState<number | null>(null)

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInView(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle feature toggle with keyboard support
  const toggleFeature = useCallback(
    (index: number) => {
      setActiveFeatureIndex(activeFeatureIndex === index ? null : index)
    },
    [activeFeatureIndex],
  )

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        toggleFeature(index)
      }
    },
    [toggleFeature],
  )

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Refined Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Modern Header */}
          <motion.header
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full mb-8">
              <ShieldCheckIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-white/80">Service Comparison</span>
            </div>

            <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-normal mb-6", pacifico.className)}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Why Choose Redirex?
              </span>
            </h1>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-6" />

            <p className="text-white/70 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
              Compare our premium global shipping solutions with the competition. Discover why industry leaders trust us
              with their most critical international deliveries.
            </p>
          </motion.header>

          {/* Modern Main Card */}
          <motion.div
            custom={1}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            {/* Enhanced Company Headers */}
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="hidden lg:block lg:col-span-1 p-8 bg-white/[0.02]">
                <div className="h-full flex items-center">
                  <h2 className="text-white/90 font-semibold text-lg">Features</h2>
                </div>
              </div>

              {companies.map((company, index) => (
                <motion.div
                  custom={index + 2}
                  variants={company.isOurs ? premiumVariants : fadeInVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  key={company.name}
                  className={cn(
                    "p-6 lg:p-8 relative group transition-all duration-500",
                    company.isOurs
                      ? "bg-gradient-to-b from-slate-800/60 via-gray-800/50 to-slate-800/60 border-l border-r border-slate-700/30"
                      : "bg-white/[0.01] hover:bg-white/[0.02]",
                  )}
                  role="columnheader"
                  aria-label={`Company: ${company.name}`}
                  onMouseEnter={() => setHoveredCompany(index)}
                  onMouseLeave={() => setHoveredCompany(null)}
                >
                  {company.isOurs && (
                    <>
                      {/* Premium Column Effects */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-700/20 via-gray-700/15 to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-indigo-400 to-rose-400" />

                      {/* Subtle inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-rose-500/[0.02]" />

                      {/* Side accent lines */}
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent" />
                      <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-transparent via-rose-400/40 to-transparent" />
                    </>
                  )}

                  <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <h3
                        className={cn(
                          "text-xl lg:text-2xl font-semibold",
                          company.isOurs ? "text-white" : "text-white/80",
                        )}
                      >
                        {company.name}
                      </h3>
                      {company.isOurs && (
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatDelay: 3,
                          }}
                        >
                          <BadgeCheckIcon className="w-5 h-5 text-indigo-400" />
                        </motion.div>
                      )}
                    </div>

                    <p className={cn("text-sm lg:text-base mb-4", company.isOurs ? "text-slate-300" : "text-white/60")}>
                      {company.tagline}
                    </p>

                    {company.isOurs && (
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-700/40 border border-slate-600/40 rounded-full text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        Recommended
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Features */}
            {features.map((feature, featureIndex) => (
              <motion.div
                custom={featureIndex + 6}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                key={`feature-${featureIndex}`}
                className={cn("transition-all duration-300", activeFeatureIndex === featureIndex && "bg-white/[0.02]")}
              >
                <div
                  className="grid grid-cols-1 lg:grid-cols-5 cursor-pointer group hover:bg-white/[0.01] transition-colors duration-300"
                  onClick={() => toggleFeature(featureIndex)}
                  onKeyDown={(e) => handleKeyDown(e, featureIndex)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={activeFeatureIndex === featureIndex}
                  aria-label={`Toggle details for ${feature.name}`}
                >
                  {/* Enhanced Feature Name */}
                  <div className="p-6 lg:p-8 flex items-center justify-between lg:col-span-1 bg-white/[0.02] group-hover:bg-white/[0.03] transition-all duration-300">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white/90 mb-2 text-lg group-hover:text-white transition-colors duration-300">
                        {feature.name}
                      </h4>
                      <p className="text-sm text-white/60 hidden sm:block lg:hidden xl:block leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <motion.div
                      animate={{
                        rotate: activeFeatureIndex === featureIndex ? 180 : 0,
                        scale: activeFeatureIndex === featureIndex ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                      className="lg:hidden ml-4"
                    >
                      <ChevronDownIcon className="w-5 h-5 text-white/60 group-hover:text-indigo-400 transition-colors duration-300" />
                    </motion.div>
                  </div>

                  {/* Enhanced Feature Values */}
                  {feature.companies.map((companyFeature, companyIndex) => (
                    <div
                      key={`feature-${featureIndex}-company-${companyIndex}`}
                      className={cn(
                        "p-6 lg:p-8 flex flex-col items-center justify-center relative transition-all duration-300",
                        companyIndex === 0
                          ? "bg-gradient-to-b from-slate-800/40 via-gray-800/30 to-slate-800/40 group-hover:from-slate-800/50 group-hover:via-gray-800/40 group-hover:to-slate-800/50 border-l border-r border-slate-700/20"
                          : "group-hover:bg-white/[0.01]",
                        hoveredCompany === companyIndex && companyIndex === 0 && "ring-1 ring-slate-600/40",
                        hoveredCompany === companyIndex && companyIndex !== 0 && "ring-1 ring-white/20",
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-1"
                      >
                        {companyFeature.hasFeature ? (
                          <CheckIcon
                            className={cn("w-7 h-7", companyIndex === 0 ? "text-indigo-400" : "text-white/60")}
                            aria-label={`${companies[companyIndex].name} has ${feature.name}`}
                          />
                        ) : (
                          <XIcon
                            className="w-7 h-7 text-rose-400/70"
                            aria-label={`${companies[companyIndex].name} does not have ${feature.name}`}
                          />
                        )}
                      </motion.div>

                      <div className="hidden lg:block text-xs text-center mt-3 text-white/60 max-w-32 leading-relaxed">
                        {companyFeature.details}
                      </div>

                      <div className="block lg:hidden text-sm mt-2 font-medium text-white/80">
                        {companies[companyIndex].name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Expandable Details */}
                <AnimatePresence mode="wait">
                  {activeFeatureIndex === featureIndex && (
                    <motion.div
                      variants={detailsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="lg:hidden px-6 pb-6 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-4">
                        {feature.companies.map((companyFeature, companyIndex) => (
                          <motion.div
                            key={`details-${featureIndex}-${companyIndex}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: companyIndex * 0.1 }}
                            className={cn(
                              "p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01]",
                              companyIndex === 0
                                ? "bg-gradient-to-r from-slate-800/50 to-gray-800/50 border-slate-600/30"
                                : "bg-white/[0.03] border-white/[0.08]",
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              {companyFeature.hasFeature ? (
                                <CheckIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                              ) : (
                                <XIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                              )}
                              <span className="font-medium text-sm text-white/90">{companies[companyIndex].name}</span>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed pl-7">{companyFeature.details}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
