import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { contactSchema, type ContactInput } from '../../schemas/contact'
import { sendContact } from '../../services/contact'
import { Notice } from '../ui/Notice'

type Feedback = { tone: 'success' | 'error'; text: string } | null

interface FieldProps {
  id: string
  label: string
  error?: string
  children: (props: {
    id: string
    'aria-invalid': boolean
    'aria-describedby'?: string
  }) => React.ReactNode
}

function Field({ id, label, error, children }: FieldProps) {
  const errorId = `${id}-erro`
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-display text-base font-semibold">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="mt-1.5 font-display text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [feedback, setFeedback] = useState<Feedback>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '', website: '' },
  })

  async function onSubmit(values: ContactInput) {
    setFeedback(null)
    try {
      await sendContact(values)
      setFeedback({ tone: 'success', text: 'Mensagem enviada. Obrigado pelo contato!' })
      reset()
    } catch (error) {
      setFeedback({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Não foi possível enviar a mensagem.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid max-w-2xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Nome" error={errors.name?.message}>
          {(p) => <input {...p} {...register('name')} className="field" autoComplete="name" />}
        </Field>
        <Field id="contact-email" label="E-mail" error={errors.email?.message}>
          {(p) => (
            <input
              {...p}
              {...register('email')}
              type="email"
              className="field"
              autoComplete="email"
            />
          )}
        </Field>
      </div>
      <Field id="contact-subject" label="Assunto" error={errors.subject?.message}>
        {(p) => <input {...p} {...register('subject')} className="field" />}
      </Field>
      <Field id="contact-message" label="Mensagem" error={errors.message?.message}>
        {(p) => <textarea {...p} {...register('message')} rows={6} className="field resize-y" />}
      </Field>

      {/* Honeypot: invisível para pessoas, tentador para robôs. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="contact-website">Não preencha</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Enviar mensagem'}
        </button>
      </div>

      <div aria-live="polite">
        {feedback && <Notice tone={feedback.tone}>{feedback.text}</Notice>}
      </div>
    </form>
  )
}
