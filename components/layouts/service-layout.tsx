import type { ReactNode } from "react"
import PageHeader from "@/components/layouts/page-header"

interface ServiceLayoutProps {
  title: string
  subtitle: string
  description: string
  icon: ReactNode
  children: ReactNode
}

export default function ServiceLayout({ title, subtitle, description, icon, children }: ServiceLayoutProps) {
  return (
    <main className="bg-[#030303] text-white">
      <PageHeader title={title} subtitle={subtitle} icon={icon} />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-white/70 text-lg leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      {children}
    </main>
  )
}

