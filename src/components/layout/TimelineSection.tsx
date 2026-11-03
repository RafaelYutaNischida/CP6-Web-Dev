import { SITE } from '../../config/site'
import type { TimelineItem } from '../../types'
import { Placeholder } from '../ui/Placeholder'
import { Section } from '../ui/Section'

function Timeline({
  title,
  items,
  field,
}: {
  title: string
  items: TimelineItem[]
  field: string
}) {
  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      {items.length === 0 ? (
        <Placeholder field={field} />
      ) : (
        <ol className="space-y-6 border-l border-line pl-6">
          {items.map((item) => (
            <li key={`${item.title}-${item.period}`}>
              <p className="font-display text-sm text-muted">{item.period}</p>
              <p className="font-display text-lg font-semibold">{item.title}</p>
              <p className="text-base text-muted">{item.organization}</p>
              {item.description && <p className="mt-1 text-base">{item.description}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function TimelineSection() {
  return (
    <Section id="trajetoria" title="Experiência e formação">
      <div className="grid gap-12 lg:grid-cols-2">
        <Timeline title="Experiência" items={SITE.experience} field="experience" />
        <Timeline title="Formação acadêmica" items={SITE.education} field="education" />
      </div>
    </Section>
  )
}
