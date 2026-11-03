import type { ContactInput } from '../schemas/contact'
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '../utils/env'

export class ContactError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContactError'
  }
}

/**
 * Envia a mensagem para a Edge Function `send-contact`, que revalida os dados,
 * grava no Supabase e envia o e-mail. Nenhuma chave privada passa pelo front-end.
 */
export async function sendContact(input: ContactInput): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new ContactError('O envio ainda não está configurado neste ambiente.')
  }

  let response: Response
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(input),
    })
  } catch {
    throw new ContactError('Sem conexão. Verifique sua internet e tente novamente.')
  }

  if (response.status === 429) {
    throw new ContactError('Muitas mensagens em pouco tempo. Aguarde alguns minutos.')
  }
  if (!response.ok) {
    throw new ContactError('Não foi possível enviar agora. Tente novamente em instantes.')
  }
}
