export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 text-muted">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-line border-t-accent"
      />
      <span>{label}</span>
    </div>
  )
}
