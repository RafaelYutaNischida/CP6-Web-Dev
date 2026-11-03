# Decisões tecnológicas

| Tecnologia                       | Por quê                                          | Alternativas              | Vantagens / limitações                                                       |
| -------------------------------- | ------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------- |
| React + Vite + TS                | SPA simples, build rápido                        | Next.js, Astro            | Leve e direto. Sem SSR: SEO/OG tags limitados.                               |
| React Router                     | Rotas + lazy por rota                            | TanStack Router           | Padrão de mercado.                                                           |
| Tailwind 3                       | Tokens por CSS variables, tema escuro por classe | CSS Modules               | Rápido de manter. Classes verbosas.                                          |
| Supabase                         | Auth + Postgres + RLS + Functions num lugar só   | Firebase, backend próprio | RLS declarativo. Free tier pausa projetos inativos.                          |
| GitHub REST sem token            | Dados reais, sem segredo                         | GraphQL (exige token)     | 60 req/h por IP: mitigado por cache/ETag.                                    |
| RHF + Zod                        | Schema único para validar                        | Formik, Yup               | Zod também roda na Edge Function.                                            |
| Resend                           | API simples de e-mail                            | SendGrid, SMTP            | Sem domínio verificado só envia ao dono da conta.                            |
| Vitest + RTL                     | Integra com Vite                                 | Jest                      | Rápido.                                                                      |
| Fontes self-hosted (@fontsource) | Sem requisição a terceiros, melhor LCP           | Google Fonts              | +2 dependências; subsets por unicode-range.                                  |
| Hook `useResource` próprio       | Estados loading/erro em ~40 linhas               | TanStack Query            | Zero dependência; sem cache compartilhado (cache do GitHub fica no serviço). |

**Não adotados:** Framer Motion e Three.js (peso sem necessidade), TanStack Query, commitlint (os Conventional Commits ficam como convenção documentada; pode ser adicionado depois).

**Edge Function duplica o schema Zod** (Deno não importa de `src/` de forma confiável). Está comentado nos dois arquivos para manter sincronia.

**Imagens:** o site não usa imagens raster por padrão (identidade tipográfica). A foto opcional (`SITE.avatar`) aceita WebP/AVIF, renderiza com `width`/`height` e `loading="lazy"`.
