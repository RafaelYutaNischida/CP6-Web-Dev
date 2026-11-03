import { SITE } from '../../config/site'
import { Placeholder } from '../ui/Placeholder'
import { Section } from '../ui/Section'

export function AboutSection() {
  const { avatar, bio } = SITE
  return (
    <Section id="sobre" title="Sobre mim">
      <div className="flex flex-col gap-8 md:flex-row">
        {avatar && (
          <img
            src={avatar.src}
            width={avatar.width}
            height={avatar.height}
            alt={avatar.alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-48 rounded-md object-cover"
          />
        )}
        <div className="max-w-prose space-y-4">
          {bio.length > 0 ? (
            bio.map((p) => <p key={p}>{p}</p>)
          ) : (
            <Placeholder field="bio (texto da seção Sobre mim)" />
          )}
        </div>
      </div>
    </Section>
  )
}
