import { ContactForm } from '../forms/ContactForm'
import { Section } from '../ui/Section'

export function ContactSection() {
  return (
    <Section id="contato" title="Contato">
      <p className="mb-8 max-w-prose text-muted">
        Envie uma mensagem pelo formulário. Ela chega por e-mail e fica registrada para resposta.
      </p>
      <ContactForm />
    </Section>
  )
}
