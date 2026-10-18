'use client'

import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faqCategoryLabels, faqItems, type FaqCategory } from '@/lib/faq'
import { cn } from '@/lib/utils'

const categories = Object.keys(faqCategoryLabels) as FaqCategory[]

export function FaqList({ initialCategory = 'persone' }: { initialCategory?: FaqCategory }) {
  const [category, setCategory] = useState<FaqCategory>(initialCategory)
  const items = faqItems.filter((item) => item.category === category)

  return (
    <div>
      <div role="group" aria-label="Filtra le domande frequenti" className="flex flex-wrap gap-2">
        {categories.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            aria-controls="faq-elenco"
            onClick={() => setCategory(value)}
            className={cn(
              'min-h-11 rounded-full border px-5 text-sm font-medium transition-colors',
              category === value
                ? 'border-ocean bg-ocean text-white'
                : 'border-ocean/20 bg-white text-ocean hover:border-ocean/50',
            )}
          >
            {faqCategoryLabels[value]}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {`${items.length} domande nella categoria ${faqCategoryLabels[category]}`}
      </p>

      <div id="faq-elenco" className="mt-8 rounded-2xl border border-border bg-white px-5 sm:px-8">
        <Accordion key={category}>
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question} className="border-border">
              <AccordionTrigger className="gap-4 py-5 text-base font-semibold text-ocean hover:no-underline sm:text-lg [&_[data-slot=accordion-trigger-icon]]:mt-1 [&_[data-slot=accordion-trigger-icon]]:text-ocean">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
