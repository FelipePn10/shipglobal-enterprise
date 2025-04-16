"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import PageHeader from "@/components/layouts/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FAQAccordion from "@/components/services/faq-accordion";

// Types
interface Plan {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}

interface AdditionalService {
  service: string;
  description: string;
  price: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function PricingPage() {
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
  };

  const personalPlans: Plan[] = [
    {
      title: "Basic",
      price: "$9.99",
      period: "per month",
      description: "Perfect for occasional international shoppers",
      features: [
        "Personal shipping address in 1 country",
        "30-day package storage",
        "Standard photo verification (3 photos)",
        "Standard shipping options",
        "Email support",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      title: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Ideal for regular international shoppers",
      features: [
        "Personal shipping addresses in 3 countries",
        "60-day package storage",
        "Advanced photo verification (10 photos)",
        "All shipping options including express",
        "Package consolidation (up to 5 packages)",
        "Priority email and chat support",
      ],
      buttonText: "Get Premium",
      popular: true,
    },
    {
      title: "Elite",
      price: "$39.99",
      period: "per month",
      description: "For frequent shoppers with complex needs",
      features: [
        "Personal shipping addresses in all countries",
        "90-day package storage",
        "Unlimited photo verification",
        "All shipping options with discounted rates",
        "Unlimited package consolidation",
        "Priority support with dedicated agent",
        "Free shipping insurance (up to $500)",
      ],
      buttonText: "Get Elite",
      popular: false,
    },
  ];

  const businessPlans: Plan[] = [
    {
      title: "Business Starter",
      price: "$49.99",
      period: "per month",
      description: "For small businesses starting global sourcing",
      features: [
        "Business shipping addresses in 3 countries",
        "60-day package storage",
        "Standard photo verification (10 photos)",
        "All shipping options",
        "Package consolidation (up to 10 packages)",
        "Business hours support",
      ],
      buttonText: "Start Business Plan",
      popular: false,
    },
    {
      title: "Business Pro",
      price: "$99.99",
      period: "per month",
      description: "For growing businesses with regular imports",
      features: [
        "Business shipping addresses in all countries",
        "90-day package storage",
        "Advanced photo verification (unlimited)",
        "All shipping options with 10% discount",
        "Unlimited package consolidation",
        "Priority support with dedicated agent",
        "Basic inventory management",
        "Customs documentation assistance",
      ],
      buttonText: "Get Business Pro",
      popular: true,
    },
    {
      title: "Business Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for large-scale operations",
      features: [
        "Custom shipping solution",
        "Extended storage options",
        "Comprehensive verification services",
        "Custom shipping rates",
        "Advanced inventory management",
        "Full customs clearance service",
        "Dedicated account manager",
        "API integration options",
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ];

  const additionalServices: AdditionalService[] = [
    {
      service: "Extra Storage",
      description: "Extended storage beyond plan limits",
      price: "$0.50 per package per day",
    },
    {
      service: "Additional Photos",
      description: "Extra product photos beyond plan limits",
      price: "$1 per photo",
    },
    {
      service: "Package Consolidation",
      description: "Combining multiple packages into one shipment",
      price: "$5 per package (free for Premium and above)",
    },
    {
      service: "Repackaging",
      description: "Removing original packaging to reduce shipping costs",
      price: "$3 per package",
    },
    {
      service: "Shipping Insurance",
      description: "Coverage for lost or damaged packages",
      price: "3% of declared value",
    },
    {
      service: "Express Processing",
      description: "Priority handling of your package",
      price: "$10 per package",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle. When upgrading, you'll immediately gain access to the new features, and we'll prorate the difference.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "We offer a 14-day free trial of our Premium plan for new users. This allows you to experience our service before committing to a paid subscription. No credit card is required for the trial.",
    },
    {
      question: "How are shipping costs calculated?",
      answer:
        "Shipping costs are separate from subscription fees and are calculated based on package dimensions, weight, shipping method, and destination. You'll see exact shipping costs before confirming any shipment.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "We pride ourselves on transparency. Your subscription covers the features listed in your plan. Additional services like extra storage or special handling are clearly priced. Import duties and taxes are determined by customs authorities and are not included in our fees.",
    },
    {
      question: "Do you offer discounts for annual subscriptions?",
      answer:
        "Yes, we offer a 20% discount when you choose annual billing for any of our plans. This option is available during signup or can be changed in your account settings.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for business accounts. All payments are processed securely through our payment partners.",
    },
  ];

  return (
    <main className="bg-[#030303] text-white">
      <PageHeader
        title="Pricing"
        subtitle="Transparent pricing for all your global shipping needs"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Choose Your Plan
              </span>
            </h2>

            <div className="mx-auto mb-8 h-1 w-20 bg-gradient-to-r from-indigo-500 to-rose-500" />

            <p className="leading-relaxed text-white/70">
              Select the plan that best fits your international shopping needs,
              whether you&apos;re an individual shopper or a business.
            </p>
          </motion.div>

          <Tabs defaultValue="personal" className="mx-auto w-full max-w-5xl">
            <TabsList className="mx-auto mb-12 grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-0">
              <div className="grid gap-8 md:grid-cols-3">
                {personalPlans.map((plan, index) => (
                  <motion.div
                    key={plan.title}
                    custom={index + 1}
                    variants={fadeInVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={cn(
                      "relative rounded-xl border border-white/[0.08] bg-white/[0.03] p-6",
                      plan.popular &&
                        "border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-indigo-500 px-3 py-1 text-xs font-bold text-white">
                        Most Popular
                      </div>
                    )}

                    <h3
                      className={cn(
                        "mb-2 text-2xl font-semibold text-white/90",
                        plan.popular && "text-indigo-400"
                      )}
                    >
                      {plan.title}
                    </h3>

                    <div className="mb-4 flex items-baseline">
                      <span className="text-3xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="ml-2 text-white/60">{plan.period}</span>
                    </div>

                    <p className="mb-6 text-white/70">{plan.description}</p>

                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check
                            className={cn(
                              "mt-0.5 h-5 w-5 flex-shrink-0",
                              plan.popular ? "text-indigo-400" : "text-white/60"
                            )}
                          />
                          <span className="text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/auth/register" className="block">
                      <Button
                        className={cn(
                          "w-full",
                          plan.popular
                            ? "bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                            : "bg-white/[0.05] text-white hover:bg-white/[0.08]"
                        )}
                        aria-label={`Get started with ${plan.title} plan`}
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-0">
              <div className="grid gap-8 md:grid-cols-3">
                {businessPlans.map((plan, index) => (
                  <motion.div
                    key={plan.title}
                    custom={index + 1}
                    variants={fadeInVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={cn(
                      "relative rounded-xl border border-white/[0.08] bg-white/[0.03] p-6",
                      plan.popular &&
                        "border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-indigo-500 px-3 py-1 text-xs font-bold text-white">
                        Most Popular
                      </div>
                    )}

                    <h3
                      className={cn(
                        "mb-2 text-2xl font-semibold text-white/90",
                        plan.popular && "text-indigo-400"
                      )}
                    >
                      {plan.title}
                    </h3>

                    <div className="mb-4 flex items-baseline">
                      <span className="text-3xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="ml-2 text-white/60">{plan.period}</span>
                    </div>

                    <p className="mb-6 text-white/70">{plan.description}</p>

                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check
                            className={cn(
                              "mt-0.5 h-5 w-5 flex-shrink-0",
                              plan.popular ? "text-indigo-400" : "text-white/60"
                            )}
                          />
                          <span className="text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={
                        plan.title === "Business Enterprise"
                          ? "/contact"
                          : "/auth/register"
                      }
                      className="block"
                    >
                      <Button
                        className={cn(
                          "w-full",
                          plan.popular
                            ? "bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                            : "bg-white/[0.05] text-white hover:bg-white/[0.08]"
                        )}
                        aria-label={`Get started with ${plan.title} plan`}
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="bg-white/[0.01] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Additional Services
              </span>
            </h2>

            <div className="mx-auto mb-8 h-1 w-20 bg-gradient-to-r from-indigo-500 to-rose-500" />

            <p className="leading-relaxed text-white/70">
              Customize your experience with these optional services available to
              all plan levels.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th
                      className="px-6 py-4 text-left text-white/90"
                      scope="col"
                    >
                      Service
                    </th>
                    <th
                      className="px-6 py-4 text-left text-white/90"
                      scope="col"
                    >
                      Description
                    </th>
                    <th
                      className="px-6 py-4 text-right text-white/90"
                      scope="col"
                    >
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {additionalServices.map((service, index) => (
                    <tr
                      key={service.service}
                      className={
                        index < additionalServices.length - 1
                          ? "border-b border-white/10"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 text-white/80">
                        {service.service}
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {service.description}
                      </td>
                      <td className="px-6 py-4 text-right text-white/80">
                        {service.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
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
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                Frequently Asked Questions
              </span>
            </h2>

            <div className="mx-auto mb-8 h-1 w-20 bg-gradient-to-r from-indigo-500 to-rose-500" />

            <p className="leading-relaxed text-white/70">
              Find answers to common questions about our pricing and plans.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <FAQAccordion items={faqs} />
          </motion.div>
        </div>
      </section>

      <section className="bg-white/[0.01] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 md:p-12 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />

            <div className="relative z-10">
              <motion.div
                custom={0}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-8 text-center"
              >
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                    Need a Custom Solution?
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-white/70">
                  Contact our team for personalized pricing and solutions tailored
                  to your specific needs.
                </p>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col justify-center gap-4 sm:flex-row"
              >
                <Link href="/contact">
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-rose-500 px-6 py-3 font-medium text-white hover:from-indigo-600 hover:to-rose-600"
                    aria-label="Contact sales team"
                  >
                    Contact Sales <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white/80 hover:bg-white/[0.03]"
                    aria-label="Create a new account"
                  >
                    Create Account
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}