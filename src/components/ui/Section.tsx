import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  children: ReactNode
}

/** Layout editorial: título fixo à esquerda no desktop, conteúdo à direita. */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-line py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[14rem_1fr] md:gap-12">
        <h2 className="text-3xl font-semibold md:sticky md:top-24 md:self-start">{title}</h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}
