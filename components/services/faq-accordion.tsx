"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
          <AccordionTrigger className="text-white/90 hover:text-white text-left">{item.question}</AccordionTrigger>
          <AccordionContent className="text-white/70">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

