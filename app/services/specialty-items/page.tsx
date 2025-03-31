import ServiceLayout from "@/components/layouts/service-layout"
import { Package, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ServiceFeature from "@/components/services/service-feature"
import ServiceProcess from "@/components/services/service-process"
import ServiceTestimonial from "@/components/services/service-testimonial"
import ServiceCTA from "@/components/services/service-cta"
import SpecialtyItemCard from "@/components/services/specialty-item-card"

export default function SpecialtyItemsPage() {
  const features = [
    {
      title: "Extra Protective Packaging",
      description: "Custom packaging solutions for fragile, valuable, or unusual items",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Insurance Options",
      description: "Comprehensive insurance coverage for high-value specialty items",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "White Glove Delivery",
      description: "Premium delivery service with installation and packaging removal",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Real-time Tracking",
      description: "Advanced tracking technology for monitoring your valuable shipments",
      icon: <Package className="h-5 w-5" />,
    },
  ]

  const steps = [
    {
      title: "Consultation",
      description: "Discuss your specialty item and specific shipping requirements with our experts",
    },
    {
      title: "Custom Solution",
      description: "We develop a tailored shipping plan for your unique item",
    },
    {
      title: "Specialized Packaging",
      description: "Your item is carefully packaged using appropriate materials and techniques",
    },
    {
      title: "Insurance Coverage",
      description: "We arrange appropriate insurance coverage based on the item's value",
    },
    {
      title: "Secure Transport",
      description: "Your item is transported using the most secure and appropriate method",
    },
    {
      title: "Delivery Confirmation",
      description: "Receive confirmation and documentation of successful delivery",
    },
  ]

  const testimonials = [
    {
      quote:
        "I needed to ship an antique grandfather clock internationally. The team provided custom crating and white glove service that ensured it arrived in perfect condition.",
      author: "Thomas R.",
      location: "United Kingdom",
      rating: 5,
    },
    {
      quote:
        "Their specialty handling of my art collection was impeccable. The custom packaging and insurance gave me complete peace of mind.",
      author: "Elena M.",
      location: "Italy",
      rating: 5,
    },
    {
      quote:
        "I was amazed at how they handled the shipping of my vintage motorcycle. The attention to detail and care was outstanding.",
      author: "David L.",
      location: "Canada",
      rating: 5,
    },
  ]

  const specialtyCategories = [
    {
      title: "Fine Art & Antiques",
      description: "Custom crating and climate-controlled shipping for valuable art and antiques",
      image: "/placeholder.svg?height=200&width=300",
      items: ["Paintings", "Sculptures", "Antique furniture", "Collectibles"],
    },
    {
      title: "Musical Instruments",
      description: "Specialized handling for delicate and valuable musical instruments",
      image: "/placeholder.svg?height=200&width=300",
      items: ["Pianos", "String instruments", "Vintage guitars", "Orchestral instruments"],
    },
    {
      title: "Electronics & Technology",
      description: "Secure shipping for sensitive electronic equipment and technology",
      image: "/placeholder.svg?height=200&width=300",
      items: ["Server equipment", "Medical devices", "Broadcasting equipment", "Prototype technology"],
    },
    {
      title: "Vehicles & Machinery",
      description: "Comprehensive shipping solutions for vehicles and industrial machinery",
      image: "/placeholder.svg?height=200&width=300",
      items: ["Classic cars", "Motorcycles", "Industrial equipment", "Specialized machinery"],
    },
  ]

  return (
    <ServiceLayout
      title="Specialty Items"
      subtitle="Expert handling for unique shipments"
      description="Our specialty items service provides customized shipping solutions for high-value, fragile, oversized, or unusual items that require special care during international transit."
      icon={<Package className="h-8 w-8" />}
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

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Specialty Categories
            </h2>
            <p className="text-white/70">We specialize in shipping a wide range of unique and valuable items</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {specialtyCategories.map((category, index) => (
              <SpecialtyItemCard
                key={index}
                title={category.title}
                description={category.description}
                image={category.image}
                items={category.items}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Our Specialty Shipping Process
            </h2>
            <p className="text-white/70">A meticulous approach to handling your valuable and unique items</p>
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
              Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Customer Experiences
            </h2>
            <p className="text-white/70">Hear from clients who trusted us with their valuable specialty items</p>
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
        title="Have a Specialty Item to Ship?"
        description="Contact our specialists for a customized shipping solution"
        buttonText="Get a Custom Quote"
        buttonLink="/contact"
      />
    </ServiceLayout>
  )
}

