# Configuração dos serviços externos

Estes passos exigem suas contas; não dá para automatizá-los daqui. Siga na ordem.

## 1. Rodar localmente (sem Supabase)

```bash
npm install
cp .env.example .env     # VITE_GITHUB_USER já vem preenchido
npm run dev
```

Sem Supabase: projetos, tema e rotas funcionam; formulário mostra "envio não configurado"; /admin mostra aviso.

## 2. Supabase

1. Crie um projeto em supabase.com.
2. SQL Editor → cole e execute `supabase/migrations/20260101000000_init.sql`.
3. Authentication → Providers → Email: **desative "Allow new users to sign up"** (só você terá conta).
4. Authentication → Users → **Add user** (e-mail e senha). Copie o UUID do usuário.
5. SQL Editor: `insert into public.admins (user_id) values ('<UUID>');`
6. Project Settings → API: copie **Project URL** e **anon public key** para `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Nunca use a service role no front.

## 3. E-mail (Resend) + Edge Function

1. Crie conta em resend.com e uma API key.
2. Sem domínio verificado, o Resend só envia para o e-mail da própria conta — use-o como `OWNER_EMAIL`.
3. Com a Supabase CLI (`npm i -g supabase` ou `npx supabase`):

```bash
supabase login
supabase link --project-ref <ref-do-projeto>
supabase secrets set RESEND_API_KEY=... OWNER_EMAIL=voce@exemplo.com ALLOWED_ORIGIN=https://SEU-SITE.vercel.app
supabase functions deploy send-contact
```

4. Teste enviando o formulário; confira a tabela `messages` e sua caixa de entrada.

## 4. GitHub + Vercel

1. Crie o repositório no GitHub e envie o código (`git remote add origin ...`, `git push -u origin main`).
2. vercel.com → Add New Project → importe o repositório (framework Vite detectado).
3. Environment Variables: `VITE_GITHUB_USER`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Pushes na `main` publicam automaticamente. O `vercel.json` já faz o rewrite de SPA.
5. Atualize `ALLOWED_ORIGIN` na função com a URL final e redeploy da função.

## 5. Conteúdo pessoal

Edite `src/config/site.ts` (título, bio, habilidades, formação, experiência, redes). Foto opcional em WebP/AVIF com `width`/`height`.

## 6. Verificação em produção (marque você mesmo)

- [ ] Home carrega e lista repositórios
- [ ] `/projetos/<repo>` abre direto e após F5
- [ ] Rota inexistente mostra 404
- [ ] Formulário envia, grava em `messages` e o e-mail chega
- [ ] `/admin` sem login redireciona; login admin entra; outro usuário é negado
- [ ] Mensagens e destaques funcionam; destaques aparecem na home
- [ ] Sem erros críticos no console
