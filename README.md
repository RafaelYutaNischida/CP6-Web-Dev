# Portfólio - Rafael Yuta Nischida (CP3 · Stack e Harness Engineering)

Portfólio profissional em React + TypeScript. Os projetos vêm automaticamente da API do GitHub, o formulário de contato grava no Supabase e envia e-mail por uma Edge Function, e um dashboard protegido por Supabase Auth + RLS gerencia mensagens e projetos em destaque.

## Objetivo

Apresentar trabalho e trajetória com uma base de engenharia real: arquitetura por camadas, segurança, testes, versionamento e um harness de IA documentado.

## Demonstração e capturas

- Site publicado: **_preencher após o deploy na Vercel_**
- Capturas de tela: **_adicionar em `docs/screenshots/` após rodar o projeto_** (não foram geradas no ambiente de desenvolvimento, que não tinha navegador).

## Tecnologias

React 19, Vite, TypeScript, React Router, Tailwind CSS, Supabase (Auth/Postgres/RLS/Edge Functions), API REST do GitHub, React Hook Form + Zod, Vitest + React Testing Library, ESLint, Prettier, Husky + lint-staged, Vercel, Resend. Justificativas e alternativas em [docs/DECISIONS.md](docs/DECISIONS.md).

## Funcionalidades

Home (navbar, hero, sobre, habilidades, projetos, trajetória, contato, footer) · tema claro/escuro persistido sem flash · `/projetos/:nome` · `/admin` (lazy, protegido) · 404 e página de erro de dados · skeletons e estados loading/erro/vazio/sucesso · cache + ETag + tratamento de rate limit do GitHub · validação por campo no formulário e no servidor · RLS.

## Estrutura de pastas

```
src/
├── config/        site.ts (textos editáveis)
├── components/    ui/ layout/ projects/ forms/ admin/
├── pages/         Home, ProjectDetail, Login, Dashboard, AdminApp, NotFound, DataError
├── routes/        AppRoutes, ProtectedRoute
├── hooks/  contexts/  services/  schemas/  types/  utils/  styles/
supabase/          migrations/ (tabelas + RLS)  functions/send-contact/
tests/             Vitest + RTL        docs/    documentação
```

## Arquitetura e fluxo de dados

Diagrama e explicação em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Instalação e variáveis de ambiente

```bash
npm install
cp .env.example .env
npm run dev
```

| Variável                                                         | Onde                         | Descrição                                       |
| ---------------------------------------------------------------- | ---------------------------- | ----------------------------------------------- |
| `VITE_GITHUB_USER`                                               | front                        | usuário do GitHub (padrão `RafaelYutaNischida`) |
| `VITE_SUPABASE_URL`                                              | front                        | URL do projeto Supabase                         |
| `VITE_SUPABASE_ANON_KEY`                                         | front                        | chave anon (pública; protegida por RLS)         |
| `RESEND_API_KEY`, `OWNER_EMAIL`, `RESEND_FROM`, `ALLOWED_ORIGIN` | **secrets da Edge Function** | nunca vão ao front                              |

Configuração completa de Supabase, Resend e Vercel: [docs/SETUP.md](docs/SETUP.md).

## Comandos

| Comando                                                 | O que faz                                |
| ------------------------------------------------------- | ---------------------------------------- |
| `npm run dev`                                           | servidor de desenvolvimento              |
| `npm run build`                                         | typecheck + build de produção            |
| `npm run preview`                                       | serve o build                            |
| `npm run typecheck` / `npm run lint` / `npm run format` | qualidade                                |
| `npm run test:run`                                      | testes uma vez (`npm test` = modo watch) |

## Testes

`npm run test:run` — 14 testes: validação do formulário (campos vazios, e-mail inválido, mensagem curta, envio válido, botão desabilitado, falha de envio), proteção do dashboard (sem autenticação, admin, não-admin, carregando) e serviço do GitHub (filtros, cache, rate limit, ordenação). Os testes mockam o envio; o fluxo real com Supabase/Resend precisa ser validado após a configuração.

## Git

GitHub Flow, `feature/` `fix/` `docs/`, Conventional Commits, Husky + lint-staged. Detalhes em [docs/GIT_FLOW.md](docs/GIT_FLOW.md).

## Harness de IA

- [AGENTS.md](AGENTS.md): regras que a IA deve seguir (ler antes de editar, respeitar a arquitetura, rodar typecheck/lint/testes, não instalar dependências sem justificativa, não commitar sem autorização, nunca expor segredos).
- Ferramenta realmente usada: **Claude (chat do claude.ai)** para planejar e gerar o código; sem MCPs ou skills personalizadas. _Se você usar outra ferramenta (Claude Code, Cursor…), liste aqui._
- Verificações executadas na geração: `tsc --noEmit`, ESLint, Vitest e `vite build` (todos passando). Lighthouse: ver [docs/LIGHTHOUSE.md](docs/LIGHTHOUSE.md).

## Desempenho

Não há nota de Lighthouse registrada: ela precisa ser medida na URL publicada ([docs/LIGHTHOUSE.md](docs/LIGHTHOUSE.md)).

## Critérios de aceitação

[docs/ACCEPTANCE.md](docs/ACCEPTANCE.md)
