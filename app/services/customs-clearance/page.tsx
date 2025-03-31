import ServiceLayout from "@/components/layouts/service-layout"
import { FileCheck, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ServiceFeature from "@/components/services/service-feature"
import ServiceProcess from "@/components/services/service-process"
import ServiceTestimonial from "@/components/services/service-testimonial"
import ServiceCTA from "@/components/services/service-cta"
import FAQAccordion from "@/components/services/faq-accordion"

export default function CustomsClearancePage() {
  const features = [
    {
      title: "Documentation Preparation",
      description: "Expert preparation of all required customs documentation",
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      title: "Customs Compliance",
      description: "Ensuring all shipments comply with international customs regulations",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Duty & Tax Calculation",
      description: "Accurate calculation of import duties and taxes for transparent billing",
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      title: "Customs Representation",
      description: "Professional representation with customs authorities in multiple countries",
      icon: <FileCheck className="h-5 w-5" />,
    },
  ]

  const steps = [
    {
      title: "Pre-Shipment Review",
      description: "We review your shipment details to identify any potential customs issues",
    },
    {
      title: "Documentation Preparation",
      description: "Our experts prepare all necessary customs documentation for your shipment",
    },
    {
      title: "Classification & Valuation",
      description: "We properly classify your goods and determine accurate customs valuation",
    },
    {
      title: "Duty & Tax Calculation",
      description: "We calculate all applicable duties, taxes, and fees for your shipment",
    },
    {
      title: "Customs Submission",
      description: "Documentation is submitted to customs authorities for clearance approval",
    },
    {
      title: "Clearance Monitoring",
      description: "We actively monitor the clearance process and address any inquiries",
    },
    {
      title: "Release & Delivery",
      description: "Once cleared, your shipment is released for final delivery to its destination",
    },
  ]

  const testimonials = [
    {
      quote:
        "Their customs clearance expertise saved us from significant delays and potential fines. The team navigated complex regulations with ease.",
      author: "Marcus J.",
      location: "Import Manager, TechGlobal",
      rating: 5,
    },
    {
      quote:
        "As someone who regularly imports specialty goods, having reliable customs clearance support has been invaluable. They handle everything professionally and efficiently.",
      author: "Sophia R.",
      location: "Business Owner, Canada",
      rating: 5,
    },
    {
      quote:
        "The customs documentation preparation service alone has saved us countless hours and prevented numerous headaches. Highly recommended.",
      author: "Daniel K.",
      location: "Logistics Director, FashionImports",
      rating: 4,
    },
  ]

  const faqs = [
    {
      question: "What documents are typically required for customs clearance?",
      answer:
        "Common documents include commercial invoice, packing list, bill of lading or airway bill, certificate of origin, and product-specific certificates. Our team will advise you on the exact requirements for your specific shipment and destination country.",
    },
    {
      question: "How long does the customs clearance process take?",
      answer:
        "Customs clearance timeframes vary by country, shipment type, and current processing volumes. Simple shipments can clear in 1-2 days, while complex ones may take 5-7 days. Our pre-clearance preparation helps minimize delays.",
    },
    {
      question: "Can you handle customs clearance for restricted or regulated items?",
      answer:
        "Yes, we specialize in navigating the complex requirements for restricted and regulated items. Our team has experience with electronics, food products, pharmaceuticals, and other items that require special permits or documentation.",
    },
    {
      question: "How do you calculate import duties and taxes?",
      answer:
        "Import duties and taxes are calculated based on the product's HS code (tariff classification), country of origin, value, and the importing country's regulations. We provide transparent calculations and can help identify potential duty exemptions or reductions.",
    },
    {
      question: "What happens if customs selects my shipment for inspection?",
      answer:
        "If your shipment is selected for inspection, our team will coordinate with customs authorities, provide any additional information required, and ensure the process moves forward as efficiently as possible. We'll keep you informed throughout the process.",
    },
    {
      question: "Do you offer customs bond services?",
      answer:
        "Yes, we can arrange customs bonds for shipments entering countries that require them. We offer both single-entry and continuous bonds depending on your shipping frequency and needs.",
    },
  ]

  return (
    <ServiceLayout
      title="Customs Clearance"
      subtitle="Expert navigation through international regulations"
      description="Our customs clearance service ensures smooth passage of your shipments through international borders with expert documentation preparation, compliance management, and customs representation."
      icon={<FileCheck className="h-8 w-8" />}
    >
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <ServiceFeature key={index} title={feature.title} description={feature.description} icon={feature.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              The Customs Clearance Process
            </h2>
            <p className="text-white/70">Our systematic approach ensures efficient customs processing</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <ServiceProcess
                key={index}
                step={index + 1}
                title={step.title}
                description={step.description}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Our Customs Expertise
            </h2>
            <p className="text-white/70">We specialize in customs clearance for various industries and product types</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Consumer Goods</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Electronics and technology products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Clothing and textiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Home goods and furniture</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Regulated Products</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Food and agricultural products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Pharmaceuticals and medical devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Chemicals and hazardous materials</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">High-Value Items</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Luxury goods and jewelry</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Art and collectibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Vehicles and machinery</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Special Shipments</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Temporary imports for exhibitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Samples and promotional materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Personal effects and relocations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Trade Compliance</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Free trade agreement qualification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Duty drawback and refund programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Import/export compliance audits</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Documentation Services</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Certificates of origin</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Import/export licenses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Product-specific certifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70">Common questions about our customs clearance services</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Client Experiences
            </h2>
            <p className="text-white/70">Hear from clients who rely on our customs clearance expertise</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <ServiceTestimonial
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                location={testimonial.location}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      <ServiceCTA
        title="Need Customs Clearance Assistance?"
        description="Our experts are ready to help with your international shipping needs"
        buttonText="Contact Our Customs Team"
        buttonLink="/contact"
      />
    </ServiceLayout>
  )
}

