import ServiceLayout from "@/components/layouts/service-layout"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ServiceFeature from "@/components/services/service-feature"
import ServiceProcess from "@/components/services/service-process"
import ServiceTestimonial from "@/components/services/service-testimonial"
import ServiceCTA from "@/components/services/service-cta"

export default function PersonalShoppingPage() {
  const features = [
    {
      title: "Global Access",
      description: "Shop from retailers worldwide that don't ship to your location",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Package Consolidation",
      description: "Combine multiple purchases into a single shipment to save on shipping costs",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Photo Verification",
      description: "Receive photos of your items before they're shipped to ensure they meet your expectations",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Repackaging Options",
      description: "Choose how your items are packaged to minimize shipping costs or maximize protection",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
  ]

  const steps = [
    {
      title: "Sign Up",
      description: "Create your account and get your personal shopping address in our supported countries",
    },
    {
      title: "Shop Online",
      description: "Shop at any online retailer and use your provided address as the shipping destination",
    },
    {
      title: "We Receive Your Package",
      description: "We'll notify you when your package arrives and send photos if requested",
    },
    {
      title: "Choose Shipping Options",
      description: "Select your preferred shipping method, insurance, and packaging options",
    },
    {
      title: "We Ship to You",
      description: "We'll forward your package to your home address anywhere in the world",
    },
  ]

  const testimonials = [
    {
      quote:
        "I've been able to shop from my favorite US brands even though they don't ship to my country. The service is reliable and the staff is always helpful.",
      author: "Maria L.",
      location: "Brazil",
      rating: 5,
    },
    {
      quote:
        "The photo verification feature gives me peace of mind when ordering expensive items. I know exactly what I'm getting before it ships to me.",
      author: "James T.",
      location: "Australia",
      rating: 5,
    },
    {
      quote:
        "Package consolidation has saved me hundreds on international shipping. I can shop from multiple stores and have everything shipped together.",
      author: "Sophia K.",
      location: "Singapore",
      rating: 4,
    },
  ]

  return (
    <ServiceLayout
      title="Personal Shopping"
      subtitle="Shop globally without boundaries"
      description="Our personal shopping service allows individuals to shop from international retailers that don't ship to their country, with packages forwarded to their doorstep."
      icon={<ShoppingBag className="h-8 w-8" />}
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
              How Personal Shopping Works
            </h2>
            <p className="text-white/70">Our streamlined process makes it easy to shop from retailers worldwide</p>
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
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              What Our Customers Say
            </h2>
            <p className="text-white/70">Hear from people who have used our personal shopping service</p>
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
        title="Ready to Shop Globally?"
        description="Create your account today and get access to your personal shopping address"
        buttonText="Start Shopping Globally"
        buttonLink="/auth/register"
      />
    </ServiceLayout>
  )
}

