# Aplicação web

O frontend do Movie Garden é uma aplicação React 19 + TypeScript executada pelo Vite. Ele contém as páginas públicas, o catálogo autenticado, a biblioteca, os detalhes de filmes e séries e a integração com o TMDB.

Consulte a documentação na raiz:

- [Visão geral e tutorial](../../README.md)
- [Arquitetura](../../docs/ARCHITECTURE.md)
- [Guia de desenvolvimento](../../docs/DEVELOPMENT.md)

## Comandos

Na raiz do monorepo:

```bash
pnpm --filter web dev
pnpm --filter web build
```

O frontend usa `apps/web/.env`. Os nomes e exemplos estão em [`.env.example`](.env.example).
