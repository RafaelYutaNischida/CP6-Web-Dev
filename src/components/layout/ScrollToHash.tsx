import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Rola até a âncora (#id) ao navegar e volta ao topo em rotas sem hash. */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}
