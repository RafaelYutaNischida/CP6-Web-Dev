import { z } from 'zod'

export const MESSAGE_MIN_LENGTH = 20

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.').max(100, 'Nome muito longo (máx. 100).'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .max(200, 'E-mail muito longo.')
    .pipe(z.email('Informe um e-mail válido.')),
  subject: z
    .string()
    .trim()
    .min(1, 'Informe o assunto.')
    .max(150, 'Assunto muito longo (máx. 150).'),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN_LENGTH, `A mensagem precisa ter ao menos ${MESSAGE_MIN_LENGTH} caracteres.`)
    .max(5000, 'Mensagem muito longa (máx. 5000).'),
  // Honeypot: humanos não preenchem. O servidor descarta silenciosamente se vier preenchido.
  website: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
