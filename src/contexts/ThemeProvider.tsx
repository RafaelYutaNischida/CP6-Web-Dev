import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './theme-context'

function readInitialTheme(): Theme {
  // O script inline do index.html já aplicou a classe antes da pintura.
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.style.colorScheme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Sem persistência: a preferência vale apenas nesta sessão.
    }
    setTheme(next)
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
