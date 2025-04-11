import ServiceLayout from "@/components/layouts/service-layout"
import { Briefcase, ArrowRight, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import ServiceFeature from "@/components/services/service-feature"
import ServiceProcess from "@/components/services/service-process"
import ServiceTestimonial from "@/components/services/service-testimonial"
import ServiceCTA from "@/components/services/service-cta"
import ServiceComparisonTable from "@/components/services/service-comparison-table"

export default function BusinessImportingPage() {
  const features = [
    {
      title: "Bulk Shipping Discounts",
      description: "Benefit from volume-based shipping rates for regular business imports",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Inventory Management",
      description: "Track your shipments and inventory with our business dashboard",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Customs Documentation",
      description: "We handle all necessary customs paperwork for smooth importing",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Dedicated Account Manager",
      description: "Get personalized support from a dedicated business account manager",
      icon: <Briefcase className="h-5 w-5" />,
    },
  ]

  const steps = [
    {
      title: "Business Registration",
      description: "Register your business and provide necessary documentation for import/export",
    },
    {
      title: "Sourcing Consultation",
      description: "Work with our team to identify suppliers and products for your business needs",
    },
    {
      title: "Order Processing",
      description: "Place orders through our platform or have suppliers ship directly to our warehouse",
    },
    {
      title: "Quality Control",
      description: "We inspect your products to ensure they meet your specifications before shipping",
    },
    {
      title: "Customs Clearance",
      description: "Our experts handle all customs documentation and clearance procedures",
    },
    {
      title: "Delivery to Your Business",
      description: "Products are delivered to your business location or distribution center",
    },
  ]

  const testimonials = [
    {
      quote:
        "Redirex has transformed our supply chain. We're now able to source products from international suppliers with minimal hassle and competitive shipping rates.",
      author: "Robert M.",
      location: "CEO, TechImports Inc.",
      rating: 5,
    },
    {
      quote:
        "Having a dedicated account manager has made all the difference. They understand our business needs and have helped us navigate complex importing regulations.",
      author: "Sarah J.",
      location: "Operations Director, Global Retail",
      rating: 5,
    },
    {
      quote:
        "The inventory management system has streamlined our operations. We can track shipments in real-time and plan our stock levels accordingly.",
      author: "Michael P.",
      location: "Supply Chain Manager, EcoProducts",
      rating: 4,
    },
  ]

  const comparisonData = {
    headers: ["Features", "Traditional Importing", "With Redirex"],
    rows: [
      ["Shipping Costs", "High individual rates", "Bulk discounted rates"],
      ["Customs Handling", "Complex paperwork", "Fully managed service"],
      ["Supplier Management", "Direct communication", "Consolidated management"],
      ["Quality Control", "Limited or none", "Professional inspection"],
      ["Delivery Timeline", "Unpredictable", "Scheduled and tracked"],
      ["Support", "Minimal", "Dedicated account manager"],
    ],
  }

  return (
    <ServiceLayout
      title="Business Importing"
      subtitle="Streamline your international procurement"
      description="Our business importing service helps companies source products globally with professional logistics support, customs clearance, and dedicated account management."
      icon={<Briefcase className="h-8 w-8" />}
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
              The Business Importing Process
            </h2>
            <p className="text-white/70">A comprehensive approach to international procurement for your business</p>
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
              Schedule a Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Traditional Importing vs. Redirex
            </h2>
            <p className="text-white/70">See how our business importing service compares to traditional methods</p>
          </div>

          <ServiceComparisonTable headers={comparisonData.headers} rows={comparisonData.rows} />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Business Success Stories
            </h2>
            <p className="text-white/70">Hear from businesses that have transformed their importing process</p>
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
        title="Ready to Optimize Your Business Importing?"
        description="Schedule a consultation with our business importing specialists"
        buttonText="Get Started"
        buttonLink="/contact"
        secondaryButtonText="Download Brochure"
        secondaryButtonLink="/resources/business-importing-brochure.pdf"
      />
    </ServiceLayout>
  )
}

