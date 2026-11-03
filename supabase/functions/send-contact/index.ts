// Edge Function (Deno): valida, salva a mensagem e envia o e-mail ao proprietário.
// Secrets necessários: RESEND_API_KEY, OWNER_EMAIL (opcionais: RESEND_FROM, ALLOWED_ORIGIN).
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetados automaticamente pelo Supabase.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@4'

// Mantenha em sincronia com src/schemas/contact.ts.
const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).max(200).pipe(z.email()),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(20).max(5000),
  website: z.string().optional(),
})

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? '*'
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) return json({ error: 'validation_failed' }, 400)
  const { website, ...data } = parsed.data

  // Honeypot preenchido: finge sucesso e descarta.
  if (website && website.trim() !== '') return json({ ok: true })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  // Limite simples por e-mail para reduzir spam.
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const { count, error: countError } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('email', data.email)
    .gte('created_at', since)
  if (countError) {
    console.error('rate-limit check failed', countError.message)
    return json({ error: 'server_error' }, 500)
  }
  if ((count ?? 0) >= RATE_LIMIT_MAX) return json({ error: 'rate_limited' }, 429)

  const { error: insertError } = await supabase.from('messages').insert(data)
  if (insertError) {
    console.error('insert failed', insertError.message)
    return json({ error: 'server_error' }, 500)
  }

  // E-mail: a mensagem já está salva; falha aqui não perde o contato.
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const owner = Deno.env.get('OWNER_EMAIL')
  let emailSent = false
  if (apiKey && owner) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: Deno.env.get('RESEND_FROM') ?? 'Portfolio <onboarding@resend.dev>',
          to: [owner],
          reply_to: data.email,
          subject: `[Portfólio] ${data.subject}`,
          html: `<p><strong>${escapeHtml(data.name)}</strong> (${escapeHtml(data.email)})</p>
<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
        }),
      })
      emailSent = res.ok
      if (!res.ok) console.error('resend failed', res.status)
    } catch (error) {
      console.error('resend error', error instanceof Error ? error.message : 'unknown')
    }
  } else {
    console.error('RESEND_API_KEY/OWNER_EMAIL não configurados')
  }

  return json({ ok: true, emailSent })
})
