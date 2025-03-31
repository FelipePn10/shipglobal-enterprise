"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Users,
  Globe,
  TrendingUp,
  Award,
  Lightbulb,
} from "lucide-react"
import PageHeader from "@/components/layouts/page-header"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function CareersPage() {
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

  const benefits = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world with our distributed team structure",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Competitive Compensation",
      description: "Salary packages that recognize your skills and experience",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Comprehensive Healthcare",
      description: "Full medical, dental, and vision coverage for you and your family",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Schedule",
      description: "Work hours that fit your lifestyle and productivity patterns",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Career Growth",
      description: "Clear advancement paths and professional development opportunities",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Inclusive Environment",
      description: "A diverse and supportive workplace where everyone belongs",
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

  const openings = [
    {
      title: "Senior Software Engineer",
      department: "Technology",
      location: "Remote (Global)",
      type: "Full-time",
      description:
        "Join our engineering team to build and enhance our global shipping platform. You'll work on challenging problems in logistics, e-commerce integration, and user experience.",
    },
    {
      title: "Logistics Coordinator",
      department: "Operations",
      location: "Singapore",
      type: "Full-time",
      description:
        "Coordinate international shipments, manage carrier relationships, and ensure smooth operations at our Singapore facility.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Service",
      location: "Remote (APAC)",
      type: "Full-time",
      description:
        "Lead our customer success initiatives in the Asia-Pacific region, ensuring clients receive exceptional support and maximize the value of our services.",
    },
    {
      title: "Business Development Representative",
      department: "Sales",
      location: "Remote (Europe)",
      type: "Full-time",
      description: "Drive growth by identifying and pursuing new business opportunities across European markets.",
    },
    {
      title: "Warehouse Operations Specialist",
      department: "Operations",
      location: "Los Angeles, USA",
      type: "Full-time",
      description:
        "Manage day-to-day warehouse operations, including package receiving, processing, and shipping at our US facility.",
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote (Global)",
      type: "Full-time",
      description:
        "Create and execute digital marketing campaigns to increase brand awareness and drive customer acquisition globally.",
    },
  ]

  return (
    <main className="bg-[#030303] text-white">
      <PageHeader title="Careers" subtitle="Join our global team and help connect the world" />

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
                  Join Our Mission
                </span>
              </h2>

              <p className="text-white/70 mb-6 leading-relaxed">
                At Global Reach Solutions, we're building a world where geographical boundaries no longer limit access
                to products and services. Our team is passionate about connecting people with the global marketplace and
                creating innovative solutions to complex logistics challenges.
              </p>

              <p className="text-white/70 mb-6 leading-relaxed">
                We're a diverse, distributed team working across multiple time zones and cultures. This global
                perspective is at the heart of everything we do, allowing us to better understand and serve our
                international customer base.
              </p>

              <p className="text-white/70 leading-relaxed">
                If you're excited about transforming international commerce and want to be part of a fast-growing
                company that values innovation, excellence, and work-life balance, we'd love to hear from you.
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
                  src="/placeholder.svg?height=600&width=800&text=Team Photo"
                  alt="Global Reach team"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>

              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                <p className={cn("text-xl text-white/90", pacifico.className)}>"Building bridges across borders"</p>
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
                Life at Global Reach
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              We believe in creating an environment where talented people can do their best work, grow professionally,
              and enjoy the journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
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
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">{benefit.title}</h3>
                <p className="text-white/70">{benefit.description}</p>
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
                Our Values
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              These core principles guide our work and define our culture.
            </p>
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
                Open Positions
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto mb-8" />

            <p className="text-white/70 leading-relaxed">
              Explore our current opportunities and find your place on our global team.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {openings.map((job, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.05] transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white/90">{job.title}</h3>
                    <p className="text-white/60 mt-1">{job.department}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center text-white/60 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  <Link href={`/careers/${job.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button className="whitespace-nowrap bg-white/[0.05] hover:bg-white/[0.08] text-white">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-white/70 mt-4 border-t border-white/10 pt-4">{job.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={openings.length + 1}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-white/70 mb-6">
              Don't see a position that matches your skills? We're always looking for talented individuals to join our
              team.
            </p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                Send Spontaneous Application
              </Button>
            </Link>
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
                    Our Hiring Process
                  </span>
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto">
                  We've designed a straightforward hiring process to help us get to know you better while respecting
                  your time.
                </p>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <ol className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">Application Review</h3>
                      <p className="text-white/70">
                        Our team reviews your application and resume to assess your qualifications and experience.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">Initial Interview</h3>
                      <p className="text-white/70">
                        A video call with our recruiting team to discuss your background, experience, and interest in
                        the role.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">Skills Assessment</h3>
                      <p className="text-white/70">
                        Depending on the role, you may complete a practical assessment or case study related to the
                        position.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">Team Interviews</h3>
                      <p className="text-white/70">
                        Meet with potential teammates and cross-functional partners to explore how you'll work together.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">Final Decision & Offer</h3>
                      <p className="text-white/70">
                        We make a decision and extend an offer to the selected candidate, followed by onboarding
                        planning.
                      </p>
                    </div>
                  </li>
                </ol>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

