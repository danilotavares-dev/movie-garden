# Movie Garden

![React](https://img.shields.io/badge/React-19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.13%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)

> Seu jardim pessoal para descobrir, organizar e conversar sobre filmes e séries.

O **Movie Garden** é uma aplicação fullstack para explorar o catálogo do [TMDB](https://www.themoviedb.org/), salvar títulos em uma watchlist, avaliar conteúdos e receber recomendações personalizadas por inteligência artificial.

O projeto está em desenvolvimento ativo. As funcionalidades principais de catálogo, autenticação, biblioteca, comunidade e recomendações estão implementadas, mas a API e a interface ainda podem sofrer alterações.

## Demonstração

![Página inicial](assets/inicial.png)

![Página de catálogo](assets/catalogo.gif)

## Funcionalidades

- Catálogo de filmes e séries consumido pela API do TMDB.
- Busca geral por títulos, com resultados paginados e opção de carregar mais resultados.
- Busca por IA em um painel lateral, usando linguagem natural para pedidos como:
  - “filmes de terror psicológico”;
  - “séries parecidas com Dark”;
  - “comédias inteligentes dos anos 90”.
- Recomendações geradas pelo Google Gemini e associadas aos títulos encontrados no TMDB.
- Cadastro e login de usuários.
- Autenticação por JWT e proteção das rotas privadas.
- Watchlist pessoal para salvar filmes e séries.
- Avaliações e mensagens na comunidade de cada título.
- Interface responsiva construída com Tailwind CSS.
- Internacionalização em português, inglês e espanhol.
- Componentes compartilhados no pacote `@movie-garden/ui`.

## Arquitetura

O repositório usa `pnpm workspaces` para organizar o frontend, a API, o motor de IA e o design system em um único monorepo.

```text
projeto-movie-garden/
├── apps/
│   ├── api/                 # API HTTP: Fastify, Prisma e PostgreSQL
│   ├── ai-engine/           # Serviço de recomendações: FastAPI e Gemini
│   └── web/                 # Aplicação web: React, Vite e TypeScript
├── packages/
│   └── ui/                 # Componentes compartilhados do frontend
├── assets/                 # Imagens usadas na documentação
├── docker-compose.yml       # PostgreSQL para desenvolvimento local
├── package.json             # Scripts e dependências da workspace
└── pnpm-workspace.yaml
```

### Fluxo de recomendações

1. O frontend envia o pedido autenticado para `POST /recommendations`.
2. A API encaminha o pedido para o serviço Python em `POST /recommend`.
3. O Gemini interpreta o pedido e retorna uma lista JSON de filmes e séries.
4. O frontend consulta o TMDB para localizar os títulos e exibe os resultados.

## Tecnologias

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- i18next e `react-i18next`

### API

- Node.js 20+
- Fastify
- Prisma ORM
- PostgreSQL
- Zod
- JSON Web Token
- bcryptjs

### Motor de IA

- Python 3.13+
- FastAPI
- Uvicorn
- Google Gen AI SDK
- Pydantic

## Pré-requisitos

Instale antes de começar:

- [Node.js](https://nodejs.org/) 20 ou superior;
- [pnpm](https://pnpm.io/) 10 ou superior;
- [Python](https://www.python.org/) 3.13 ou superior;
- [Poetry](https://python-poetry.org/) para gerenciar o motor de IA;
- [Docker](https://www.docker.com/) e Docker Compose, ou uma instância PostgreSQL compatível;
- uma chave da API do [TMDB](https://www.themoviedb.org/settings/api);
- uma chave da API do [Google Gemini](https://aistudio.google.com/apikey).

## Instalação

Clone o repositório e instale as dependências JavaScript:

```bash
git clone https://github.com/nilo-labs/movie-garden.git
cd movie-garden
pnpm install
```

Instale as dependências Python:

```bash
cd apps/ai-engine
poetry install
cd ../..
```

## Variáveis de ambiente

### API e banco de dados

O servidor Fastify carrega o arquivo `.env` da raiz do repositório. Crie `./.env`:

```env
DATABASE_URL="postgresql://movie_garden:movie_garden@localhost:5433/movie_garden?schema=public"
JWT_SECRET="use-at-least-32-random-characters"
PORT=3333
CORS_ORIGIN="http://localhost:5173"
AI_ENGINE_URL="http://127.0.0.1:8000"
```

Use um valor aleatório forte para `JWT_SECRET` e mantenha todos os segredos fora do Git.

### Frontend

Crie `apps/web/.env`:

```env
VITE_API_URL="/api"
VITE_TMDB_API_KEY="sua_chave_tmdb"
VITE_TMDB_BASE_URL="https://api.themoviedb.org/3"
```

Variáveis com prefixo `VITE_` são incorporadas ao bundle e podem ser visualizadas no navegador. A chave do TMDB usada no frontend deve ser tratada como uma chave pública, com as restrições e configurações de segurança disponíveis no TMDB. Nunca coloque chaves privadas ou credenciais de banco nesse arquivo.

### Motor de IA

O serviço Python carrega o arquivo `.env` localizado em `apps/ai-engine/.env`. Crie:

```env
GEMINI_API_KEY="sua_chave_gemini"
PORT=8000
CORS_ORIGINS="http://localhost:3333"
```

Não versionar arquivos `.env`, chaves de API, tokens ou credenciais.

## Banco de dados

Suba o PostgreSQL com Docker Compose a partir da raiz:

```bash
docker compose up -d postgres
```

O container publica o PostgreSQL na porta `5433` do host. Caso use outro banco, ajuste `DATABASE_URL`.

Gere o cliente Prisma e aplique as migrações:

```bash
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate deploy
```

Para desenvolvimento com alterações no schema, use:

```bash
pnpm --filter api exec prisma migrate dev
```

## Executando localmente

O projeto possui três processos de desenvolvimento. Abra um terminal para cada um.

### 1. API Fastify

```bash
pnpm --filter api dev
```

A API ficará disponível em `http://localhost:3333`.
O endpoint `GET /api/health` retorna o status da API.

### 2. Motor de IA

```bash
cd apps/ai-engine
poetry run python main.py
```

O motor de IA ficará disponível em `http://127.0.0.1:8000`.

Endpoint de verificação:

```bash
curl http://127.0.0.1:8000/
```

### 3. Frontend

```bash
pnpm --filter web dev
```

Abra `http://localhost:5173`.

O frontend exige autenticação para acessar o catálogo. Crie uma conta pela tela de cadastro antes de testar as áreas privadas.

## Scripts disponíveis

Na raiz:

```bash
pnpm install       # instala as dependências das workspaces
pnpm build         # executa os builds disponíveis nas workspaces
pnpm lint          # executa o Biome
pnpm format        # formata os arquivos com o Biome
```

Por aplicação:

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter api dev
pnpm --filter api start
```

## Rotas principais da API

| Método | Rota | Autenticação | Descrição |
|---|---|---:|---|
| `POST` | `/api/users` | Não | Cria uma conta |
| `POST` | `/api/login` | Não | Autentica um usuário |
| `POST` | `/api/recommendations` | Sim | Solicita recomendações à IA |
| `GET` | `/api/watchlist` | Sim | Lista a watchlist do usuário |
| `POST` | `/api/watchlist` | Sim | Adiciona um título à watchlist |
| `DELETE` | `/api/watchlist/:mediaId` | Sim | Remove um título da watchlist |
| `GET` | `/api/watchlist/:mediaId/status` | Sim | Consulta o status de um título |
| `GET` | `/api/media/:mediaType/:mediaId/community` | Sim | Lista mensagens e avaliação |
| `PUT` | `/api/media/:mediaType/:mediaId/rating` | Sim | Registra ou atualiza uma avaliação |
| `POST` | `/api/media/:mediaType/:mediaId/messages` | Sim | Publica uma mensagem |

As rotas protegidas esperam um token JWT no header:

```http
Authorization: Bearer <token>
```

## Build e verificação

Para validar o frontend:

```bash
pnpm --filter web exec tsc -b
pnpm --filter web build
```

Para validar o workspace:

```bash
pnpm lint
pnpm build
```

## Desenvolvimento e contribuição

1. Crie um fork ou uma branch a partir de `main`.
2. Faça uma alteração pequena e focada.
3. Atualize a documentação quando o comportamento público mudar.
4. Execute o type-check, o build e o lint relevantes.
5. Abra um pull request descrevendo o problema, a solução e como validar.

### Diretrizes importantes

- Não inclua segredos, arquivos `.env` ou tokens em commits.
- Preserve a tipagem TypeScript e valide entradas na API.
- Prefira os componentes existentes em `packages/ui`.
- Evite alterar funcionalidades não relacionadas ao seu pull request.
- Ao alterar o schema Prisma, inclua a migração correspondente.

## Roadmap

- [ ] Externalizar o segredo JWT para uma variável de ambiente obrigatória.
- [ ] Adicionar testes automatizados para API e frontend.
- [ ] Criar um endpoint de saúde para a API Fastify.
- [ ] Implementar chat contextual sobre um filme ou série específica.
- [ ] Melhorar a experiência em dispositivos móveis.
- [ ] Permitir perfis de usuário customizáveis.

## Licença e atribuições

Este repositório ainda não define uma licença open source. Consulte os mantenedores antes de reutilizar o código em projetos externos.

O catálogo e as imagens de filmes e séries são fornecidos pelo TMDB. Este projeto não é endossado nem certificado pelo TMDB. Consulte os [termos de uso do TMDB](https://www.themoviedb.org/terms-of-use) antes de publicar uma instância.

---

Feito com 💚 e 🍿 pela comunidade Movie Garden.
