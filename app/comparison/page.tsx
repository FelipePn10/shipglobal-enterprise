"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckIcon, XIcon, ChevronDownIcon } from "lucide-react"

export default function ServiceComparisonTable() {
  // Fix TypeScript error by properly typing the state
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInView(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const companies = [
    { 
      name: "ShipGlobal", 
      isOurs: true, 
      tagline: "Premium Global Service",
      accentColor: "from-indigo-400 to-rose-400"
    },
    { 
      name: "Competitor A", 
      isOurs: false,
      tagline: "Standard Shipping",
      accentColor: "from-slate-400 to-slate-500"
    },
    { 
      name: "Competitor B", 
      isOurs: false,
      tagline: "Budget Forwarding",
      accentColor: "from-slate-400 to-slate-500"
    },
    { 
      name: "Competitor C", 
      isOurs: false,
      tagline: "Regional Provider",
      accentColor: "from-slate-400 to-slate-500"
    }
  ]

  const features = [
    { 
      name: "Global Forwarding", 
      description: "Ship your packages to any country with customs handling and optimal routing.",
      companies: [
        { hasFeature: true, details: "200+ countries with premium service" },
        { hasFeature: true, details: "Limited to 65 countries" },
        { hasFeature: false, details: "Not available" },
        { hasFeature: true, details: "75 countries with basic service" }
      ]
    },
    { 
      name: "Package Consolidation", 
      description: "Combine multiple packages into one shipment to save on shipping costs.",
      companies: [
        { hasFeature: true, details: "Unlimited items with smart packaging" },
        { hasFeature: false, details: "Not available" },
        { hasFeature: true, details: "Limited to 5 items per package" },
        { hasFeature: false, details: "Not available" }
      ]
    },
    { 
      name: "Tax Optimization", 
      description: "Smart customs declarations and routing to minimize import taxes and duties.",
      companies: [
        { hasFeature: true, details: "Advanced AI-powered optimization" },
        { hasFeature: false, details: "Not available" },
        { hasFeature: false, details: "Not available" },
        { hasFeature: false, details: "Not available" }
      ]
    },
    { 
      name: "24/7 Support", 
      description: "Round-the-clock customer support for all your shipping questions and concerns.",
      companies: [
        { hasFeature: true, details: "Premium support with dedicated agent" },
        { hasFeature: false, details: "Limited business hours only" },
        { hasFeature: false, details: "Email only" },
        { hasFeature: true, details: "Basic 24/7 support" }
      ]
    },
    { 
      name: "Digital Tracking", 
      description: "Real-time tracking of your packages from origin to destination.",
      companies: [
        { hasFeature: true, details: "Real-time with predictive delivery" },
        { hasFeature: true, details: "Basic tracking updates" },
        { hasFeature: true, details: "Limited updates" },
        { hasFeature: false, details: "Not available" }
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }
  
  const glowVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: [0.4, 0.6, 0.4], 
      transition: { 
        repeat: Infinity, 
        duration: 4,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Background Elements - Improved for true black */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-900/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-900/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-2/3 w-64 h-64 bg-violet-900/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern - More subtle */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="inline-block text-3xl md:text-5xl font-bold mb-6 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-400">
                Service Comparison
              </span>
              <motion.div 
                variants={glowVariants}
                className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-rose-500/10 rounded-full blur-xl -z-10" 
              />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              See how our premium global shipping solutions outperform the competition in every aspect
            </p>
          </motion.div>

          {/* Main Card - Improved with deeper blacks */}
          <motion.div 
            variants={itemVariants}
            className="backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl shadow-indigo-500/5"
          >
            {/* Company Headers */}
            <div className="grid grid-cols-1 lg:grid-cols-5 border-b border-white/5">
              <div className="hidden lg:block lg:col-span-1 p-6 bg-black/60">
                <div className="h-full flex items-center">
                  <h3 className="text-gray-400 font-medium">Services</h3>
                </div>
              </div>
              
              {companies.map((company, index) => (
                <motion.div
                  variants={company.isOurs ? highlightVariants : itemVariants}
                  key={company.name}
                  className={cn(
                    "p-6 relative group",
                    company.isOurs && "bg-gradient-to-b from-indigo-950/40 to-rose-950/30"
                  )}
                >
                  {company.isOurs && (
                    <motion.div 
                      variants={glowVariants}
                      className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-500/5 to-rose-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className={cn(
                      "text-xl font-bold mb-1",
                      company.isOurs ? "text-white" : "text-gray-400"
                    )}>
                      {company.name}
                    </div>
                    <div className={cn(
                      "text-sm mb-3",
                      company.isOurs ? "text-indigo-300" : "text-gray-500"
                    )}>
                      {company.tagline}
                    </div>
                    
                    {company.isOurs && (
                      <div className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-500/10 to-rose-500/10 border border-indigo-500/20 text-indigo-300">
                        Recommended
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Features */}
            {features.map((feature, featureIndex) => (
              <motion.div 
                variants={itemVariants}
                key={`feature-${featureIndex}`}
                className={cn(
                  "border-b border-white/5 last:border-b-0",
                  activeFeatureIndex === featureIndex && "bg-white/[0.01]"
                )}
              >
                <div 
                  className="grid grid-cols-1 lg:grid-cols-5 cursor-pointer"
                  onClick={() => setActiveFeatureIndex(activeFeatureIndex === featureIndex ? null : featureIndex)}
                >
                  {/* Feature Name */}
                  <div className="p-6 flex items-center justify-between lg:col-span-1 bg-black/40">
                    <div>
                      <h4 className="font-medium text-white mb-1">{feature.name}</h4>
                      <p className="text-sm text-gray-500 hidden sm:block lg:hidden xl:block">{feature.description}</p>
                    </div>
                    <ChevronDownIcon 
                      className={cn(
                        "w-5 h-5 text-gray-500 transition-transform duration-300 lg:hidden",
                        activeFeatureIndex === featureIndex ? "transform rotate-180" : ""
                      )} 
                    />
                  </div>
                  
                  {/* Feature Value Per Company */}
                  {feature.companies.map((companyFeature, companyIndex) => (
                    <div 
                      key={`feature-${featureIndex}-company-${companyIndex}`}
                      className={cn(
                        "p-6 flex flex-col items-center justify-center relative",
                        companyIndex === 0 && "bg-gradient-to-b from-indigo-950/20 to-rose-950/10"
                      )}
                    >
                      {companyFeature.hasFeature ? (
                        <CheckIcon 
                          className={cn(
                            "w-6 h-6",
                            companyIndex === 0 ? "text-emerald-400" : "text-emerald-600/80"
                          )} 
                        />
                      ) : (
                        <XIcon 
                          className="w-6 h-6 text-rose-500/70" 
                        />
                      )}
                      
                      <div className="hidden lg:block text-xs text-center mt-2 text-gray-500">
                        {companyFeature.details}
                      </div>
                      
                      {/* Mobile details */}
                      <div className="block lg:hidden text-sm mt-1 text-gray-400">
                        {companies[companyIndex].name}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Expandable Details Section */}
                <AnimatePresence>
                  {activeFeatureIndex === featureIndex && (
                    <motion.div
                      variants={detailsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="lg:hidden px-6 pb-6 -mt-2 grid grid-cols-1 gap-4"
                    >
                      {feature.companies.map((companyFeature, companyIndex) => (
                        <div 
                          key={`details-${featureIndex}-${companyIndex}`}
                          className={cn(
                            "p-4 rounded-lg",
                            companyIndex === 0 
                              ? "bg-gradient-to-r from-indigo-950/30 to-rose-950/20 border border-indigo-900/20" 
                              : "bg-gray-900/30 border border-gray-800/20"
                          )}
                        >
                          <div className="font-medium text-sm mb-1">
                            {companies[companyIndex].name}:
                          </div>
                          <div className="text-sm text-gray-400">
                            {companyFeature.details}
                          </div>
                        </div>
                      ))}
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