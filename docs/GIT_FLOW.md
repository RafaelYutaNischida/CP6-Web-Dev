# Fluxo Git

GitHub Flow. `main` = estável e com deploy automático. Cada mudança em branch própria e integrada por Pull Request.

Prefixos: `feature/`, `fix/`, `docs/`. Ex.: `feature/github-projects`, `fix/dashboard-redirect`.

Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
Ex.: `feat: adiciona integração com GitHub`, `test: adiciona testes do formulário`.

Hooks (Husky): `pre-commit` roda `lint-staged` (ESLint + Prettier nos arquivos staged) e `npm run typecheck`.

Sugestão de ordem para versionar este código (histórico real, feito por você):

1. `docs/agents-harness` — AGENTS.md, configs de lint/format/husky
2. `feature/scaffold-theme-layout` — Vite/Tailwind, tema, layout
3. `feature/github-projects` — serviço, cards, detalhe, rotas
4. `feature/contact-form` — schema, form, Edge Function, migration
5. `feature/admin-dashboard` — auth, rotas protegidas, painéis
6. `feature/tests` — Vitest
7. `docs/readme` — README e docs

Um commit por camada coerente; não é preciso reconstruir fases que não aconteceram.
