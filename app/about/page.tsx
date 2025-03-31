"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Globe, TrendingUp, Award, Heart, Lightbulb } from "lucide-react"
import PageHeader from "@/components/layouts/page-header"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function AboutPage() {
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

  const milestones = [
    {
      year: "2015",
      title: "Company Founded",
      description:
        "ShipGlobal Solutions was established with a vision to break down international shopping barriers.",
    },
    {
      year: "2017",
      title: "Expansion to Asia",
      description: "Opened our first Asian warehouse in Singapore, expanding our global footprint.",
    },
    {
      year: "2019",
      title: "Business Services Launch",
      description:
        "Introduced specialized services for business clients, including bulk shipping and inventory management.",
    },
    {
      year: "2020",
      title: "Technology Upgrade",
      description: "Implemented advanced tracking and inventory management systems for enhanced customer experience.",
    },
    {
      year: "2022",
      title: "European Expansion",
      description: "Established operations in multiple European countries to better serve our growing customer base.",
    },
    {
      year: "2023",
      title: "Concierge Service",
      description: "Launched our premium concierge service for personalized global shopping assistance.",
    },
  ]

  const values = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Perspective",
      description: "We embrace cultural diversity and understand the nuances of international commerce.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Customer First",
      description: "Every decision we make is guided by what's best for our customers and their needs.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Continuous Improvement",
      description: "We constantly seek ways to enhance our services, processes, and technology.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our operations and service delivery.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Integrity",
      description: "We operate with honesty, transparency, and ethical business practices.",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation",
      description: "We embrace new ideas and technologies to solve complex global shipping challenges.",
    },
  ]

  const team = [
    {
      name: "Alexandra Chen",
      position: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "With over 15 years in international logistics, Alexandra founded ShipGlobal to revolutionize cross-border shopping.",
    },
    {
      name: "Marcus Johnson",
      position: "Chief Operations Officer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Marcus oversees our global operations, ensuring seamless service delivery across all our locations.",
    },
    {
      name: "Sophia Rodriguez",
      position: "Head of Customer Experience",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Sophia leads our customer service team, dedicated to providing exceptional support to our global clientele.",
    },
    {
      name: "David Kim",
      position: "Technology Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "David drives our technological innovations, developing systems that make global shopping effortless.",
    },
  ]

  return (
    <main className="bg-[#030303] text-white">
      <PageHeader title="About Us" subtitle="Our story, mission, and the team behind ShipGlobal" />

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
                  Our Story
                </span>
              </h2>

              <p className="text-white/70 mb-6 leading-relaxed">
                ShipGlobal Solutions was founded in 2015 with a simple yet powerful vision: to break down the barriers
                that prevent consumers and businesses from accessing products worldwide.
              </p>

              <p className="text-white/70 mb-6 leading-relaxed">
                Our founder, Alexandra Chen, experienced firsthand the frustration of being unable to purchase products
                from international retailers due to shipping restrictions. This personal challenge sparked the idea for
                a service that would enable anyone, anywhere, to shop globally without limitations.
              </p>

              <p className="text-white/70 leading-relaxed">
                What began as a small operation with a single warehouse has grown into a comprehensive global network
                with facilities in North America, Europe, Asia, and Australia. Today, we serve thousands of individual
                customers and businesses, helping them access products from around the world with ease and efficiency.
              </p>
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
                  src="/placeholder.svg?height=600&width=800"
                  alt="ShipGlobal team"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>

              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                <p className={cn("text-xl text-white/90", pacifico.className)}>
                  "Connecting the world, one package at a time"
                </p>
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
                Our Mission & Vision
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-white/90">Mission</h3>
              <p className="text-white/70 leading-relaxed">
                To empower individuals and businesses by providing seamless access to global products, eliminating
                geographical limitations through innovative redirection solutions and exceptional customer service.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-white/90">Vision</h3>
              <p className="text-white/70 leading-relaxed">
                To create a world where geographical boundaries no longer limit access to products and services,
                enabling a truly global marketplace accessible to everyone.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6"
              >
                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-lg inline-flex mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">{value.title}</h3>
                <p className="text-white/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                Our Journey
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              From our humble beginnings to our current global presence, we've been on a mission to revolutionize
              international shopping and product access.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex mb-12 last:mb-0"
              >
                <div className="mr-8 text-center">
                  <div className="bg-gradient-to-br from-indigo-500 to-rose-500 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-indigo-500/50 to-rose-500/50 mx-auto mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-semibold mb-2 text-white/90">{milestone.title}</h3>
                  <p className="text-white/70">{milestone.description}</p>
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
                Leadership Team
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              Meet the experienced professionals who lead our global operations and drive our mission forward.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden"
              >
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-auto"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-white/90">{member.name}</h3>
                  <p className="text-indigo-400 mb-4">{member.position}</p>
                  <p className="text-white/70 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
                    Join Our Global Community
                  </span>
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  Experience the freedom of shopping without borders and join thousands of satisfied customers who have
                  expanded their horizons with ShipGlobal.
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
                    Create an Account <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/10 hover:bg-white/[0.03] text-white/80">
                    Contact Our Team
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

