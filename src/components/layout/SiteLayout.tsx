import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { ScrollToHash } from './ScrollToHash'

export function SiteLayout() {
  return (
    <>
      <ScrollToHash />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
