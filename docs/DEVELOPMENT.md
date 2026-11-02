# Guia de desenvolvimento

## Antes de começar

Leia o [README principal](../README.md), configure os três ambientes e confirme os health checks da API e do motor de IA. Use uma branch dedicada e mantenha cada mudança com escopo pequeno.

## Onde fazer cada alteração

| Necessidade | Local recomendado |
|---|---|
| Nova página ou fluxo de navegação | `apps/web/src/pages` e `apps/web/src/App.tsx` |
| Integração com TMDB | `apps/web/src/services/tmdb.ts` |
| Integração com a API própria | `apps/web/src/services/api.ts` |
| Componente visual reutilizável | `packages/ui/src/components` |
| Tradução | Os três arquivos em `apps/web/src/locales` |
| Endpoint ou regra de autenticação | `apps/api/src/server.ts`, `controllers` ou `middlewares` |
| Persistência | `apps/api/prisma/schema.prisma` e uma migration |
| Prompt ou contrato do Gemini | `apps/ai-engine/main.py` |

## Procedimento recomendado

1. Reproduza o comportamento atual antes de editar.
2. Defina o contrato de dados e valide entradas na fronteira.
3. Reutilize serviços, tipos, componentes e traduções existentes.
4. Trate indisponibilidade de TMDB, API e IA com mensagem explícita.
5. Atualize a documentação relacionada ao comportamento público.
6. Rode os checks antes de abrir o pull request.

## Banco e migrations

Depois de editar o Prisma:

```bash
pnpm --filter api exec prisma format
pnpm --filter api exec prisma migrate dev --name descreva-a-mudanca
pnpm --filter api build
```

Não edite uma migration já aplicada em ambientes compartilhados. Crie outra migration. Lembre que o Movie Garden guarda apenas referências de mídia (`mediaId` e `mediaType`), não os dados completos do TMDB.

## Validação local

Execute o conjunto mínimo relevante:

```bash
pnpm lint
pnpm --filter web build
pnpm --filter api build
pnpm build
```

Não há testes automatizados configurados no momento. Para mudanças de integração, valide manualmente o health check, cadastro/login, catálogo, watchlist, comunidade e recomendação conforme a área alterada.

## Frontend

- Mantenha os três idiomas sincronizados.
- Prefira os componentes de `packages/ui` antes de criar duplicatas.
- Preserve as rotas privadas e o comportamento do token.
- Ao adicionar uma chamada externa, trate carregamento, vazio e erro.
- Não coloque segredos de servidor em variáveis `VITE_*`.

## API e IA

- Valide body e params com Zod/Pydantic.
- Não devolva senha, token ou credencial nas respostas.
- Mantenha limites e timeouts para chamadas ao Gemini.
- Use mensagens de erro úteis sem vazar stack trace, prompt interno ou segredo.
- Atualize [API.md](API.md) quando alterar uma rota.

## Pull requests

Descreva:

- problema e solução;
- áreas alteradas;
- migrações necessárias;
- variáveis de ambiente novas;
- comandos executados;
- validação manual, quando aplicável;
- limitações conhecidas.

Nunca inclua `.env`, chaves, tokens, dumps do banco, dados pessoais ou artefatos de `dist` gerados localmente.
