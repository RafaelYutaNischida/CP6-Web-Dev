import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
import { isFilled } from '../../utils/format'

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-base text-muted">
          <p className="font-display font-semibold text-ink">{SITE.name}</p>
          {isFilled(SITE.location) && <p>{SITE.location}</p>}
          {isFilled(SITE.email) && (
            <p>
              <a className="hover:text-accent" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
          )}
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
        <ul className="flex flex-wrap gap-5 font-display text-base">
          {SITE.social.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/admin" className="text-muted hover:text-accent">
              Área administrativa
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
