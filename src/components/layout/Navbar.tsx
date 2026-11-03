import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { to: '/#sobre', label: 'Sobre' },
  { to: '/#habilidades', label: 'Habilidades' },
  { to: '/#projetos', label: 'Projetos' },
  { to: '/#trajetoria', label: 'Trajetória' },
  { to: '/#contato', label: 'Contato' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
      >
        <Link to="/" className="font-display text-lg font-bold" onClick={() => setOpen(false)}>
          {SITE.name.split(' ')[0]}
        </Link>
        <ul className="hidden items-center gap-7 font-display text-base md:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-muted transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-md border border-line md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
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
              <path d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <ul id="menu-mobile" className="border-t border-line px-5 py-3 font-display md:hidden">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setOpen(false)} className="block py-2.5">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
