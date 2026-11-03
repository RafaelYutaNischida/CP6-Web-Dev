import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
import { isFilled } from '../../utils/format'

export function Hero() {
  const [first, ...rest] = SITE.name.split(' ')
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pb-28 md:pt-24">
      <h1 className="text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.92]">
        <span className="hero-line">{first}</span>
        <span className="hero-line text-accent">{rest.join(' ')}</span>
      </h1>
      <div className="mt-8 max-w-2xl">
        <p className="font-display text-xl font-medium md:text-2xl">
          {isFilled(SITE.role)
            ? SITE.role
            : '[título profissional: preencher em src/config/site.ts]'}
        </p>
        {isFilled(SITE.tagline) && <p className="mt-3 text-muted">{SITE.tagline}</p>}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/#projetos" className="btn btn-primary">
          Ver projetos
        </Link>
        <Link to="/#contato" className="btn btn-ghost">
          Entrar em contato
        </Link>
      </div>
    </section>
  )
}
