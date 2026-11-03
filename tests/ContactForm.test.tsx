import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../src/components/forms/ContactForm'
import type { ContactInput } from '../src/schemas/contact'

// Implementação trocável: o spy registra chamadas; a falha usa função simples
// (o rastreamento de promises rejeitadas do vi.fn gera falso "unhandled rejection").
const hoisted = vi.hoisted(() => ({
  impl: (...args: unknown[]): Promise<void> => Promise.resolve(void args),
}))

vi.mock('../src/services/contact', () => ({
  sendContact: (input: unknown) => hoisted.impl(input),
  ContactError: class ContactError extends Error {},
}))

const mockedSend = vi.fn<(input: ContactInput) => Promise<void>>()

async function fill(fields: Partial<Record<'Nome' | 'E-mail' | 'Assunto' | 'Mensagem', string>>) {
  const user = userEvent.setup()
  for (const [label, value] of Object.entries(fields)) {
    await user.type(screen.getByLabelText(label), value)
  }
  return user
}

const VALID = {
  Nome: 'Maria Silva',
  'E-mail': 'maria@exemplo.com',
  Assunto: 'Proposta de projeto',
  Mensagem: 'Olá! Gostaria de conversar sobre uma oportunidade.',
}

describe('ContactForm', () => {
  beforeEach(() => {
    mockedSend.mockReset()
    hoisted.impl = (input) => mockedSend(input as ContactInput)
  })

  it('mostra erro em cada campo obrigatório vazio', async () => {
    render(<ContactForm />)
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(await screen.findByText('Informe seu nome.')).toBeInTheDocument()
    expect(screen.getByText('Informe seu e-mail.')).toBeInTheDocument()
    expect(screen.getByText('Informe o assunto.')).toBeInTheDocument()
    expect(screen.getByText(/ao menos 20 caracteres/)).toBeInTheDocument()
    expect(mockedSend).not.toHaveBeenCalled()
  })

  it('rejeita e-mail inválido', async () => {
    render(<ContactForm />)
    const user = await fill({ ...VALID, 'E-mail': 'isso-nao-e-email' })
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(mockedSend).not.toHaveBeenCalled()
  })

  it('rejeita mensagem com menos de 20 caracteres', async () => {
    render(<ContactForm />)
    const user = await fill({ ...VALID, Mensagem: 'Muito curta' })
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(await screen.findByText(/ao menos 20 caracteres/)).toBeInTheDocument()
    expect(mockedSend).not.toHaveBeenCalled()
  })

  it('envia dados válidos e mostra sucesso', async () => {
    mockedSend.mockResolvedValue(undefined)
    render(<ContactForm />)
    const user = await fill(VALID)
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(await screen.findByText(/Mensagem enviada/)).toBeInTheDocument()
    expect(mockedSend).toHaveBeenCalledTimes(1)
    expect(mockedSend.mock.calls[0]?.[0]).toMatchObject({
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      subject: 'Proposta de projeto',
    })
  })

  it('desabilita o botão durante o envio (sem envio duplicado)', async () => {
    let resolveSend: () => void = () => {}
    mockedSend.mockReturnValue(new Promise<void>((resolve) => (resolveSend = resolve)))
    render(<ContactForm />)
    const user = await fill(VALID)
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    const busy = await screen.findByRole('button', { name: 'Enviando…' })
    expect(busy).toBeDisabled()
    await user.click(busy)
    expect(mockedSend).toHaveBeenCalledTimes(1)
    resolveSend()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Enviar mensagem' })).toBeEnabled(),
    )
  })

  it('mostra erro quando o envio falha', async () => {
    hoisted.impl = async () => {
      throw new Error('Falha simulada')
    }
    render(<ContactForm />)
    const user = await fill(VALID)
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(await screen.findByText('Falha simulada')).toBeInTheDocument()
  })
})
