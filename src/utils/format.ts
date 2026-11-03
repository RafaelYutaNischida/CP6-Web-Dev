const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormatter.format(date)
}

export function isFilled(value: string | readonly unknown[] | undefined): boolean {
  return Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim() !== ''
}
