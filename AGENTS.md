# AGENTS.md — instruções para IA neste repositório

Leia este arquivo **antes de modificar qualquer coisa**.

## Objetivo

Portfólio profissional de Rafael Yuta Nischida (CP3 – Stack e Harness Engineering). Projetos vêm da API do GitHub, contato salvo no Supabase + e-mail, dashboard admin protegido por autenticação e RLS. Nada de dados fictícios simulando funcionalidade.

## Stack

React 19 + Vite + TypeScript (strict) · React Router · Tailwind CSS 3 · Supabase (Auth, Postgres, RLS, Edge Functions) · API REST do GitHub · React Hook Form + Zod · Vitest + React Testing Library · ESLint + Prettier · Husky + lint-staged · Vercel · Resend (e-mail, só na Edge Function).

## Arquitetura (resumo)

Apresentação (`components/`, `pages/`) → hooks (`hooks/`) → serviços (`services/`) → APIs externas. Regras de validação em `schemas/`. Textos editáveis em `src/config/site.ts`. O `supabase-js` só é importado no chunk do admin (`pages/AdminApp.tsx`, lazy). A parte pública usa `fetch` direto (GitHub, PostgREST, Edge Function) para manter o JS inicial pequeno.

## Estrutura

```
src/config/    textos editáveis      src/services/  integrações externas (GitHub, Supabase)
src/components/{ui,layout,projects,forms,admin}   src/hooks/  src/contexts/
src/pages/     páginas (rotas)       src/routes/    AppRoutes + ProtectedRoute
src/schemas/   Zod                   src/types/ src/utils/ src/styles/
supabase/migrations/  SQL + RLS      supabase/functions/send-contact/  Edge Function (Deno)
tests/         Vitest + RTL          docs/          documentação
```

## Convenções

- Componentes e arquivos de componente: PascalCase. Hooks: `useX`. Variáveis/funções: camelCase. Constantes: UPPER_SNAKE_CASE. Tipos descritivos.
- Sem `any`. Sem lógica de API dentro de componentes visuais (use `services/` + hooks). Evite `useEffect` quando houver alternativa; carregamento de dados usa `useResource`.
- Contextos: o objeto em `*-context.ts`, o Provider em `*Provider.tsx`, o hook em `hooks/` (exigência do `react-refresh`).
- Todo dado externo precisa de estados: loading, erro, vazio e sucesso.
- Reutilize `components/ui/*` antes de criar componentes novos. Cores só via tokens do Tailwind (`bg-bg`, `text-ink`, `text-accent`…), nunca hex solto.
- Conteúdo pessoal: **nunca inventar** experiência, certificações ou habilidades. Campo vazio em `site.ts` mostra aviso de preenchimento.

## Segurança

- `.env` fora do Git; `.env.example` sempre atualizado. Só variáveis `VITE_*` públicas vão ao front.
- **Nunca** colocar service role key, `RESEND_API_KEY` ou qualquer segredo no front-end ou em commits.
- Toda tabela com RLS ligado. Mensagens: INSERT só via Edge Function; leitura/edição só `is_admin()`.
- Validar no cliente **e** no servidor (Edge Function). Erros ao usuário sem detalhes internos.

## Git

- GitHub Flow: `main` estável; `feature/*`, `fix/*`, `docs/*`; um PR por funcionalidade.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- **A IA não faz commit, push, merge nem PR sem autorização explícita do desenvolvedor.** Pode sugerir a mensagem de commit.

## Comandos

```
npm install        npm run dev          npm run build      npm run preview
npm run typecheck  npm run lint         npm run format     npm run test:run
```

## Regras para a IA

1. Ler este arquivo e os arquivos afetados antes de editar.
2. Respeitar a arquitetura; não mover arquivos sem necessidade; não tocar no que não foi pedido.
3. Não instalar dependência sem justificar (o que resolve, alternativa sem dependência, custo no bundle).
4. Após alteração relevante: `npm run typecheck && npm run lint && npm run test:run` (e `npm run build` se mexer em build/rotas).
5. Nunca expor informações sensíveis nem pedir que o usuário cole segredos no chat.
6. Documentar apenas ferramentas realmente usadas (ver "Harness de IA" no README).
