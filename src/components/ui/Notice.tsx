import type { ReactNode } from 'react'

interface NoticeProps {
  tone?: 'info' | 'error' | 'success'
  title?: string
  children: ReactNode
  action?: ReactNode
}

const TONES = {
  info: 'border-line',
  error: 'border-danger',
  success: 'border-ok',
} as const

export function Notice({ tone = 'info', title, children, action }: NoticeProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-md border bg-surface p-5 ${TONES[tone]}`}
    >
      {title && <p className="font-display font-semibold">{title}</p>}
      <div className="text-base text-muted">{children}</div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
