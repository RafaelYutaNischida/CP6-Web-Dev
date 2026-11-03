import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'dark' ? 'claro' : 'escuro'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Ativar tema ${next}`}
      className="grid size-10 place-items-center rounded-md border border-line text-ink transition-colors hover:border-accent hover:text-accent"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        )}
      </svg>
    </button>
  )
}
