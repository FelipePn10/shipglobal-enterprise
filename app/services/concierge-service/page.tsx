import ServiceLayout from "@/components/layouts/service-layout"
import { Users, Star, CheckCircle } from "lucide-react"
import ServiceFeature from "@/components/services/service-feature"
import ServiceProcess from "@/components/services/service-process"
import ServiceTestimonial from "@/components/services/service-testimonial"
import ServiceCTA from "@/components/services/service-cta"
import PricingCard from "@/components/services/pricing-card"

export default function ConciergeServicePage() {
  const features = [
    {
      title: "Product Sourcing",
      description: "We locate and purchase specific products on your behalf from anywhere in the world",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Purchase Assistance",
      description: "We handle the entire purchasing process, including payment and communication",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Quality Inspection",
      description: "Thorough inspection of all items before shipping to ensure they meet your standards",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "Priority Shipping",
      description: "Expedited shipping options to get your items to you as quickly as possible",
      icon: <Users className="h-5 w-5" />,
    },
  ]

  const steps = [
    {
      title: "Initial Consultation",
      description: "Discuss your specific needs and requirements with your dedicated concierge",
    },
    {
      title: "Product Research",
      description: "Your concierge researches and identifies the best options based on your criteria",
    },
    {
      title: "Proposal & Approval",
      description: "Review and approve the detailed proposal including products, costs, and timeline",
    },
    {
      title: "Procurement",
      description: "Your concierge purchases the items on your behalf and arranges delivery to our facility",
    },
    {
      title: "Quality Inspection",
      description: "Each item is carefully inspected and verified against your requirements",
    },
    {
      title: "International Shipping",
      description: "Items are securely packaged and shipped to your location with priority handling",
    },
    {
      title: "Delivery & Follow-up",
      description: "Receive your items and enjoy a follow-up consultation to ensure complete satisfaction",
    },
  ]

  const testimonials = [
    {
      quote:
        "The concierge service saved me countless hours of research and coordination. My dedicated agent understood exactly what I needed and delivered beyond my expectations.",
      author: "Alexandra K.",
      location: "Executive, Dubai",
      rating: 5,
    },
    {
      quote:
        "When I needed to furnish my international vacation home, the concierge service made it effortless. They sourced everything from furniture to local artwork with impeccable taste.",
      author: "Jonathan P.",
      location: "Business Owner, Switzerland",
      rating: 5,
    },
    {
      quote:
        "As a busy professional, I don't have time to search for specific items. My concierge handles everything from finding rare collectibles to everyday essentials with the same level of care.",
      author: "Olivia M.",
      location: "Attorney, Hong Kong",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      title: "Standard Concierge",
      price: "$199",
      period: "per month",
      description: "Perfect for individuals with occasional international shopping needs",
      features: [
        "Dedicated personal concierge",
        "Up to 5 sourcing requests per month",
        "Standard quality inspection",
        "Regular shipping options",
        "Email and chat support",
      ],
      buttonText: "Select Standard",
      popular: false,
    },
    {
      title: "Premium Concierge",
      price: "$499",
      period: "per month",
      description: "Ideal for frequent shoppers with specific requirements",
      features: [
        "Senior personal concierge",
        "Up to 15 sourcing requests per month",
        "Advanced quality inspection with photos",
        "Priority shipping options",
        "24/7 phone, email, and chat support",
        "Personalized shopping strategy",
      ],
      buttonText: "Select Premium",
      popular: true,
    },
    {
      title: "Elite Concierge",
      price: "$999",
      period: "per month",
      description: "Comprehensive service for high-volume or specialized needs",
      features: [
        "Executive personal concierge team",
        "Unlimited sourcing requests",
        "White glove quality inspection",
        "Expedited shipping included",
        "24/7 dedicated support line",
        "Custom procurement strategy",
        "Quarterly consultation calls",
      ],
      buttonText: "Select Elite",
      popular: false,
    },
  ]

  return (
    <ServiceLayout
      title="Concierge Service"
      subtitle="Your personal global procurement team"
      description="Our premium concierge service provides end-to-end assistance for all your international shopping needs, from product sourcing to delivery, handled by dedicated personal shoppers."
      icon={<Users className="h-8 w-8" />}
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
              The Concierge Experience
            </h2>
            <p className="text-white/70">A personalized approach to global procurement tailored to your needs</p>
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
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Concierge Service Plans
            </h2>
            <p className="text-white/70">Choose the level of service that best fits your needs</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                buttonText={plan.buttonText}
                popular={plan.popular}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Client Testimonials
            </h2>
            <p className="text-white/70">Hear from clients who enjoy our premium concierge service</p>
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

      <section className="py-12 md:py-16 bg-white/[0.01]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Common Concierge Requests
            </h2>
            <p className="text-white/70">Examples of how our clients use our concierge service</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Limited Edition Products</h3>
              <p className="text-white/70 mb-4">Securing limited edition releases from exclusive brands worldwide</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Designer collaborations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Regional exclusive releases</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Luxury Items</h3>
              <p className="text-white/70 mb-4">Sourcing high-end products from prestigious retailers</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Fine jewelry and watches</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Designer fashion and accessories</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Hard-to-Find Items</h3>
              <p className="text-white/70 mb-4">Locating rare or discontinued products</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Vintage collectibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Discontinued product lines</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Gift Procurement</h3>
              <p className="text-white/70 mb-4">Curating and delivering perfect gifts for special occasions</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Custom gift baskets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Personalized luxury items</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Home Furnishings</h3>
              <p className="text-white/70 mb-4">Sourcing unique furniture and decor from around the world</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Artisanal home goods</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Designer furniture pieces</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-white/90">Technology Products</h3>
              <p className="text-white/70 mb-4">Acquiring the latest tech from international markets</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Region-specific electronics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mt-0.5" />
                  <span className="text-white/70">Early-release gadgets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ServiceCTA
        title="Ready for Your Personal Concierge?"
        description="Experience the ultimate in personalized global shopping assistance"
        buttonText="Schedule a Consultation"
        buttonLink="/contact"
      />
    </ServiceLayout>
  )
}

