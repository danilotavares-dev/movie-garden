# Movie Garden

![React](https://img.shields.io/badge/React-19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.13%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)

> Seu jardim pessoal para descobrir, organizar e conversar sobre filmes e séries.

O **Movie Garden** é uma aplicação web fullstack para explorar o catálogo do [TMDB](https://www.themoviedb.org/), descobrir títulos por busca tradicional ou linguagem natural, salvar itens em uma biblioteca pessoal e compartilhar avaliações e mensagens com a comunidade.

O projeto reúne uma interface React, uma API Fastify, um banco PostgreSQL e um serviço Python que usa o Google Gemini para gerar recomendações. O catálogo e os dados de filmes não são armazenados pelo Movie Garden: eles são consultados no TMDB quando necessário.

## Por que o Movie Garden?

- **Descoberta flexível:** combine buscas comuns, listas do TMDB e pedidos em linguagem natural.
- **Biblioteca pessoal:** salve filmes e séries para consultar depois, com atualização imediata na interface.
- **Comunidade por título:** avalie conteúdos e leia ou publique mensagens associadas a um filme ou série.
- **Recomendações explicadas:** a IA retorna títulos acompanhados de um motivo curto, em vez de apenas uma lista.
- **Experiência internacionalizada:** português do Brasil, inglês e espanhol são suportados na interface e nas consultas ao TMDB.
- **Arquitetura modular:** frontend, API, IA e componentes compartilhados ficam separados no mesmo monorepo.

## Demonstração

![Página inicial](assets/inicial.png)

![Página de catálogo](assets/catalogo.gif)

## O que já está disponível

### Para quem usa o site

1. A página inicial apresenta o produto e direciona para autenticação.
2. Cadastro e login criam uma sessão JWT.
3. O catálogo privado exibe tendências, populares, mais bem avaliados, lançamentos e séries em exibição.
4. A busca tradicional procura filmes e séries no TMDB e permite carregar mais resultados.
5. A busca por IA aceita uma descrição livre, como `filmes de ficção científica com viagens no tempo`.
6. Cada recomendação da IA é localizada novamente no TMDB para apresentar pôster, nota e acesso ao detalhe.
7. A biblioteca lista os itens salvos pelo usuário.
8. As páginas de filme e série permitem consultar a comunidade, avaliar de 1 a 5 estrelas e publicar uma mensagem.
9. O seletor de idioma altera a interface e a linguagem usada nas consultas ao catálogo.

### Limites importantes

- O TMDB é a fonte de catálogo, imagens, créditos, vídeos e notas externas.
- A chave `VITE_TMDB_API_KEY` chega ao navegador; ela não é um segredo de servidor e deve ser restringida conforme os recursos disponíveis no TMDB.
- A recomendação depende do serviço Python e de uma chave do Gemini válida.
- As rotas de watchlist e comunidade exigem login.
- Não há suíte de testes automatizados configurada neste momento; lint, type-check e build são as verificações disponíveis.
- O código do projeto está disponível sob a licença Apache 2.0. Componentes, dados e serviços externos continuam sujeitos aos próprios termos.

## Arquitetura em uma página

```text
Navegador
  ├─ React + Vite
  ├─ TMDB diretamente (catálogo público)
  └─ API Fastify (/api)
       ├─ JWT + bcryptjs
       ├─ Prisma ── PostgreSQL
       └─ Serviço de IA (FastAPI)
              └─ Google Gemini
```

O fluxo detalhado, as responsabilidades de cada pasta e as decisões de integração estão em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Os contratos HTTP estão em [docs/API.md](docs/API.md).

## Estrutura do monorepo

```text
movie-garden/
├── apps/
│   ├── web/                 # React, Vite, Tailwind e i18next
│   ├── api/                 # Fastify, validação, JWT e Prisma
│   └── ai-engine/           # FastAPI e integração com Gemini
├── packages/ui/             # Componentes React compartilhados
├── assets/                  # Imagens usadas neste README
├── docker-compose.yml       # PostgreSQL para desenvolvimento
├── package.json             # Scripts da workspace
├── pnpm-workspace.yaml
└── docs/                    # Documentação técnica e de contribuição
```

## Tutorial de instalação local

### 1. Pré-requisitos

- Node.js 20 ou superior;
- pnpm 10 ou superior;
- Python 3.12 ou superior;
- Poetry 2 ou uma ferramenta compatível com o `pyproject.toml`;
- Docker e Docker Compose (recomendado para o PostgreSQL);
- chave do [TMDB](https://www.themoviedb.org/settings/api);
- chave do [Google Gemini](https://aistudio.google.com/apikey).

### 2. Baixe o código e instale as dependências

```bash
git clone https://github.com/nilo-labs/movie-garden.git
cd movie-garden
pnpm install

cd apps/ai-engine
poetry install
cd ../..
```

### 3. Configure os ambientes

Copie os exemplos sem versionar os arquivos resultantes:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp apps/ai-engine/.env.example apps/ai-engine/.env
```

Preencha os valores necessários:

- `./.env`: conexão da API com o PostgreSQL, `JWT_SECRET` com pelo menos 32 caracteres, porta, CORS e URL do motor de IA;
- no mesmo `./.env`: `FRONTEND_URL` e as credenciais SMTP usadas para enviar links de recuperação de senha;
- `apps/web/.env`: URL da API e chave pública do TMDB;
- `apps/ai-engine/.env`: chave do Gemini, modelo opcional, porta e origens permitidas.

Os exemplos são a fonte de verdade dos nomes das variáveis. Não copie credenciais reais para commits, issues, logs ou documentação.

Para recuperação de senha, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` e `SMTP_FROM`. O sistema usa SMTP genérico, portanto pode ser conectado a Gmail, Outlook, Amazon SES ou outro servidor compatível. Para contas com autenticação em duas etapas, use uma senha de aplicativo quando o provedor exigir.

### 4. Suba o banco e aplique o schema

```bash
docker compose up -d postgres
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate deploy
```

O Compose publica o PostgreSQL na porta `5433` do host. Para desenvolvimento com uma alteração de schema, use:

```bash
pnpm --filter api exec prisma migrate dev --name descreva-a-mudanca
```

### 5. Inicie os três serviços

Abra três terminais na raiz do projeto:

```bash
# Terminal 1 — API
pnpm --filter api dev

# Terminal 2 — motor de IA
cd apps/ai-engine
poetry run python main.py

# Terminal 3 — frontend
pnpm --filter web dev
```

Abra <http://localhost:5173>, crie uma conta e acesse o catálogo. Verifique os serviços com:

```bash
curl http://localhost:3333/api/health
curl http://localhost:8000/
```

### Solução rápida de problemas

| Sintoma | Verificações |
|---|---|
| API não inicia | Confira `DATABASE_URL`, `JWT_SECRET` (mínimo de 32 caracteres) e se a porta `3333` está livre. |
| Erro de banco | Rode `docker compose ps`, confirme a porta `5433` e reaplique `prisma migrate deploy`. |
| Catálogo vazio | Confira `VITE_TMDB_API_KEY`, `VITE_TMDB_BASE_URL` e o limite da chave no TMDB. |
| IA indisponível | Confirme `GEMINI_API_KEY`, o processo Python na porta `8000` e `AI_ENGINE_URL` na API. |
| CORS no navegador | Compare `CORS_ORIGIN`, `CORS_ORIGINS` e a origem real do frontend. |
| Rotas privadas retornam 401 | Faça login novamente e verifique se o token está presente no armazenamento local do navegador. |
| Link de recuperação não chega | Confira as variáveis SMTP, a pasta de spam e os logs da API; o `SMTP_FROM` deve ser aceito pelo provedor. |

## Comandos de desenvolvimento

| Comando | Finalidade |
|---|---|
| `pnpm install` | Instala dependências de todas as workspaces. |
| `pnpm lint` | Executa o Biome. |
| `pnpm format` | Formata os arquivos com o Biome. |
| `pnpm build` | Executa os builds disponíveis nas workspaces. |
| `pnpm --filter web dev` | Inicia o Vite em modo de desenvolvimento. |
| `pnpm --filter web build` | Executa type-check e build do frontend. |
| `pnpm --filter api dev` | Inicia a API com recarga via `tsx watch`. |
| `pnpm --filter api build` | Gera o Prisma Client e compila a API. |
| `pnpm --filter api exec prisma studio` | Abre o navegador de dados do Prisma. |

Não existe `pnpm dev` na raiz: os serviços devem ser iniciados separadamente, como mostrado no tutorial.

## Como contribuir com segurança

Leia [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) antes de alterar o projeto. Em resumo:

1. Crie uma branch pequena e focada.
2. Reaproveite componentes de `packages/ui` e traduções existentes.
3. Ao alterar uma entrada da API, atualize [docs/API.md](docs/API.md).
4. Ao alterar o Prisma, crie a migração correspondente.
5. Execute lint, build e os checks da workspace afetada.
6. Nunca inclua `.env`, chaves, tokens, dumps ou dados pessoais.

## Deploy

O [vercel.json](vercel.json) define três serviços na Vercel: `web`, `api` e `ai-engine`. Em produção, configure as variáveis de ambiente em cada serviço, use `VITE_API_URL=/api` no frontend e forneça um PostgreSQL acessível pela API. A configuração de CORS deve permitir somente as origens reais.

O serviço `api` também precisa das variáveis SMTP e de `FRONTEND_URL` com a URL pública do frontend. Sem SMTP configurado, a recuperação de senha não deve ser habilitada em produção.

Antes de publicar, revise limites e termos do TMDB e do Google Gemini, logs, retenção de dados, proteção de credenciais e o custo das chamadas externas.

## Créditos e licença

O Movie Garden utiliza dados e imagens do TMDB, mas não é endossado nem certificado pelo TMDB. Consulte os [termos de uso do TMDB](https://www.themoviedb.org/terms-of-use).

O código deste projeto está disponível sob a [Apache License 2.0](LICENSE). Consulte o arquivo [LICENSE](LICENSE) para conhecer os termos completos.

A licença cobre apenas o código que pode ser licenciado pelos mantenedores. O TMDB, imagens, logotipo, dados de catálogo e dependências externas permanecem sujeitos às próprias licenças e termos de uso.

Feito com 💚 e 🍿 pela comunidade Movie Garden.
