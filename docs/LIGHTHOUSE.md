# Lighthouse

**Status: NÃO MEDIDO.** Não havia navegador no ambiente de desenvolvimento, então nenhuma nota foi obtida e nenhuma é declarada aqui.

## Como medir (você, após o deploy)

1. Abra a URL de produção no Chrome (aba anônima, sem extensões).
2. DevTools → Lighthouse → Mobile → Performance → Analyze. Repita 3 vezes.
3. Ou: `npx lighthouse https://SEU-SITE.vercel.app --form-factor=mobile --only-categories=performance --view`
4. Registre a tabela abaixo com os valores reais.

| Data        | URL | Performance | LCP | CLS | TBT |
| ----------- | --- | ----------- | --- | --- | --- |
| _preencher_ |     |             |     |     |     |

## O que foi feito para ajudar (medido no build, não é nota)

- JS inicial (gzip): ~44 kB (app) + ~82 kB (react-vendor) + 0,4 kB (runtime). `supabase-js` (~55 kB gzip) e o dashboard só carregam em `/admin`; página de detalhe também é lazy.
- Fontes self-hosted (`woff2` por unicode-range, `font-weight` variável), sem terceiros.
- Skeletons com altura mínima igual à do card (CLS); tema aplicado por script inline antes da pintura.
- Sem imagens pesadas; foto opcional lazy com dimensões.
- Se a nota ficar abaixo de 80, os primeiros suspeitos: tamanho do `react-vendor`, fontes (reduzir pesos/subsets) e a requisição à API do GitHub no carregamento.
