"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"

import { Monitor, Download, Laptop, AppWindowMac, Server, ArrowRight, AppWindow } from "lucide-react"
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function DesktopAppPromo() {
  const [activeTab, setActiveTab] = useState("windows")
  
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
  
  const scaleVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }
  
  const platforms = [
    { id: "windows", name: "Windows", icon: Laptop, color: "from-blue-400 to-blue-600" },
    { id: "mac", name: "macOS", icon: AppWindowMac , color: "from-gray-300 to-gray-500" },
    { id: "linux", name: "Linux", icon: Server, color: "from-orange-400 to-orange-600" }
  ]
  
  const features = [
    "Manage all your redirected packages in one place",
    "Real-time tracking and notifications",
    "Automated customs documentation",
    "Secure payment processing",
    "Address book management"
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 " />
      <div className="absolute -top-40 -right-40 w-80 h-80 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Redirex Desktop App
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-6" />
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Take control of your international shopping experience with our powerful desktop application
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Monitor className="w-6 h-6 text-indigo-400 mr-3" />
                  <h3 className="text-2xl font-semibold text-white/90">Desktop Power</h3>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Experience the full capabilities of Redirex with our dedicated desktop application. Designed for serious international shoppers who need advanced tools and seamless workflow integration.
                </p>
                
                <h4 className={cn(
                  "text-xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-white",
                  pacifico.className,
                )}>
                  Key Features
                </h4>
                
                <ul className="text-white/70 space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.a
                  href="#download"
                  whileHover="hover"
                  whileTap="tap"
                  variants={scaleVariants}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg w-full transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-rose-500/10" />
                
                <div className="flex justify-center mb-6 relative">
                  <div className="inline-flex bg-white/[0.03] border border-white/[0.1] rounded-full p-1">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setActiveTab(platform.id)}
                        className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                          activeTab === platform.id 
                            ? `bg-gradient-to-r ${platform.color} text-white shadow-lg` 
                            : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        <platform.icon className="w-4 h-4 mr-2" />
                        {platform.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                  
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    {activeTab === "windows" && (
                      <div className="w-full h-full flex flex-col">
                        <div className="bg-gray-800 p-2 flex items-center">
                          <div className="flex space-x-1.5 ml-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                          </div>
                          <div className="mx-auto text-white/70 text-sm">Redirex Solutions Desktop</div>
                        </div>
                        <div className="flex-1 bg-gray-900 p-4 flex">
                          <div className="w-1/4 bg-gray-800 rounded-md p-2">
                            <div className="h-8 bg-indigo-500/20 rounded mb-3"></div>
                            <div className="space-y-2">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-6 bg-white/5 rounded"></div>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1 pl-4">
                            <div className="h-8 bg-white/5 rounded w-1/2 mb-4"></div>
                            <div className="grid grid-cols-2 gap-3">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-white/5 rounded-lg border border-white/10 p-3">
                                  <div className="h-3 bg-indigo-500/30 rounded w-1/2 mb-2"></div>
                                  <div className="h-2 bg-white/10 rounded w-3/4 mb-1"></div>
                                  <div className="h-2 bg-white/10 rounded w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === "mac" && (
                      <div className="w-full h-full flex flex-col">
                        <div className="bg-gray-800 p-2 flex items-center rounded-t-lg">
                          <div className="flex space-x-1.5 ml-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                          </div>
                          <div className="mx-auto text-white/70 text-sm">Redirex Solutions</div>
                        </div>
                        <div className="flex-1 bg-gray-900 p-4 flex">
                          <div className="w-1/5 bg-gray-800/50 rounded-md mr-4">
                            <div className="p-3 space-y-3">
                              {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-7 bg-white/5 rounded-md"></div>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="h-10 bg-gray-800/80 rounded-md mb-4 flex items-center px-4">
                              <div className="h-4 w-1/3 bg-white/10 rounded"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center p-4">
                                  <div className="w-8 h-8 rounded-full bg-gray-700 mb-2"></div>
                                  <div className="h-2 bg-white/10 rounded w-1/2"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === "linux" && (
                      <div className="w-full h-full flex flex-col">
                        <div className="bg-gray-800 p-2 flex items-center justify-between">
                          <div className="text-white/70 text-sm ml-2">Redirex Solutions</div>
                          <div className="flex space-x-1.5 mr-2">
                            <div className="w-3 h-3 rounded-full bg-white/20" />
                            <div className="w-3 h-3 rounded-full bg-white/20" />
                            <div className="w-3 h-3 rounded-full bg-white/20" />
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-900 p-4">
                          <div className="flex space-x-4 mb-4">
                            <div className="h-8 bg-orange-500/20 rounded-md px-4 flex items-center">Dashboard</div>
                            <div className="h-8 bg-white/5 rounded-md px-4 flex items-center">Packages</div>
                            <div className="h-8 bg-white/5 rounded-md px-4 flex items-center">Settings</div>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
                                <div className="h-5 bg-white/10 rounded w-1/4 mb-3"></div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="h-16 bg-orange-500/10 rounded-md border border-orange-500/20"></div>
                                  <div className="h-16 bg-indigo-500/10 rounded-md border border-indigo-500/20"></div>
                                </div>
                              </div>
                              <div className="p-4 bg-gray-800/50 rounded-lg">
                                <div className="h-5 bg-white/10 rounded w-1/4 mb-3"></div>
                                <div className="space-y-2">
                                  {[1, 2, 3].map(i => (
                                    <div key={i} className="h-10 bg-white/5 rounded-md flex items-center px-3">
                                      <div className="w-6 h-6 rounded-full bg-gray-700 mr-3"></div>
                                      <div className="h-3 bg-white/10 rounded w-1/3"></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="text-white/60 text-sm mb-4 md:mb-0">
                    Version 2.4.1 | Last updated: March 2025
                  </div>
                  <motion.a
                    href="#learn-more"
                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    View all features <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            custom={3}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 max-w-3xl w-full">
              <h4 className={cn(
                "text-xl mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-rose-300",
                pacifico.className,
              )}>
                System Requirements
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-white/70 text-sm">
                <div className="p-3 bg-white/[0.02] rounded-lg">
                  <div className="flex items-center mb-2">
                    <AppWindow className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="font-medium text-white/90">Windows</span>
                  </div>
                  <p>Windows 10 or later<br />4GB RAM<br />500MB free space</p>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-lg">
                  <div className="flex items-center mb-2">
                    <AppWindowMac className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium text-white/90">macOS</span>
                  </div>
                  <p>macOS 11 or later<br />4GB RAM<br />500MB free space</p>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-lg">
                  <div className="flex items-center mb-2">
                    <Laptop  className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="font-medium text-white/90">Linux</span>
                  </div>
                  <p>Ubuntu 20.04 or later<br />4GB RAM<br />500MB free space</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}