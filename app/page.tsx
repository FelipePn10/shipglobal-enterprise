import HeroGeometric from "@/components/kokonutui/hero-geometric"
import AboutSection from "@/components/sections/about-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import BenefitsSection from "@/components/sections/benefits-section"
import ExpertiseSection from "@/components/sections/expertise-section"
import ServicesSection from "@/components/sections/services-section"
import CtaSection from "@/components/sections/cta-section"
import Footer from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="bg-[#030303] text-white">
      <HeroGeometric badge="Global Reach Solutions" title1="International" title2="Product Access" />
      <AboutSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ExpertiseSection />
      <ServicesSection />
      <CtaSection />
      <Footer />
    </main>
  )
}

