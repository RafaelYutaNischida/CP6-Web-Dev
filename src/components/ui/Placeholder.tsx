/** Aviso para conteúdo pessoal ainda não preenchido em src/config/site.ts. */
export function Placeholder({ field }: { field: string }) {
  return (
    <p className="rounded-md border border-dashed border-line px-4 py-3 text-base text-muted">
      Preencher em <code className="font-display">src/config/site.ts</code>: {field}
    </p>
  )
}
