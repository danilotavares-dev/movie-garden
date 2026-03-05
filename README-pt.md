# Movie Garden

[🌍 Read in English](./README.md) | [🇧🇷 Leia em Português](./README-pt.md)

<div align="left">
  <img width="40" src="https://skillicons.dev/icons?i=react" alt="React" />
  <img width="40" src="https://skillicons.dev/icons?i=ts" alt="TypeScript" />
  <img width="40" src="https://skillicons.dev/icons?i=fastify" alt="Fastify" />
  <img width="40" src="https://skillicons.dev/icons?i=prisma" alt="Prisma" />
  <img width="40" src="https://skillicons.dev/icons?i=tailwind" alt="TailwindCSS" />
  <img width="40" src="https://skillicons.dev/icons?i=py" alt="Python" />
</div>

### 🔴 Status do Projeto: Em desenvolvimento ativo (Work in Progress). As funções principais de catálogo e biblioteca já estão funcionais, e o motor de recomendações por IA também, porem as demais funcionalidades de review ainda estão sendo refinadas.

> O seu jardim pessoal de filmes e séries. Descubra, salve e receba recomendações inteligentes baseadas no seu gosto.

O **Movie Garden** é uma aplicação web completa (Fullstack) construída com uma arquitetura moderna de **Monorepo**. Ele consome a API do TMDB para um catálogo rico de mídia e utiliza Inteligência Artificial para sugerir conteúdos com base nas descrições e preferências do usuário.

## Preview
![Página Inicial](assets/inicial.png)
![Página de Catálogo](assets/catalogo.gif)

## Funcionalidades

- **Catálogo Dinâmico:** Filmes e séries em alta, bem avaliados e recomendados, consumindo a API do TMDB.
- **Busca com Inteligência Artificial:** Não sabe o nome do filme? Descreva o que você quer assistir e a IA recomenda os melhores títulos.
- **Minha Biblioteca (Watchlist):** Salve seus filmes e séries favoritos para assistir depois.
- **Interface Otimista (Optimistic UI):** Salvamento de filmes na biblioteca com resposta visual instantânea.
- **Internacionalização (i18n):** Suporte nativo para Português (PT-BR), Inglês (EN-US) e Espanhol (ES).
- **Autenticação Segura:** Login e registro de usuários protegidos com JWT.
- **Design System Próprio:** Componentes de interface reutilizáveis isolados em um pacote dedicado (`@movie-garden/ui`).

## Tecnologias Utilizadas

Este projeto utiliza um ecossistema moderno focado em performance e tipagem estática ponta a ponta.

**Frontend (`apps/web`):**
- React (com Vite)
- TypeScript
- Tailwind CSS (Estilização)
- React Router DOM (Navegação)
- Axios (Requisições HTTP)
- i18next (Múltiplos idiomas)

**Backend (`apps/api`):**
- Node.js
- Fastify (Framework web super rápido)
- Prisma ORM (Banco de dados)
- PostgreSQL (Banco de dados relacional)
- Zod (Validação de dados)
- JWT (JSON Web Tokens para autenticação)

**Arquitetura & Ferramentas:**
- Monorepo (pnpm workspaces / Turborepo)
- ESLint & Prettier

## Estrutura do Monorepo

O projeto está dividido nas seguintes áreas principais:

```text
projeto-movie-garden/
├── apps/
│   ├── api/          # Backend (Fastify + Prisma)
│   ├── ml-engine/    # AI (Python, Gemini)
│   └── web/          # Frontend (React + Vite)
├── packages/
│   └── ui/           # Biblioteca de Componentes (Tailwind + React)
└── package.json
```

## Como executar o projeto localmente

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- Um banco de dados **PostgreSQL** rodando (local ou na nuvem)
- Uma chave de API do **TMDB (The Movie Database)**

---

### Passo a passo

#### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/projeto-movie-garden.git
cd projeto-movie-garden
```

#### 2. Instale as dependências

```bash
pnpm install
```

#### 3. Configure as Variáveis de Ambiente

- No diretório apps/api, crie um arquivo .env e adicione:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/movie_garden"
JWT_SECRET="sua_chave_secreta_super_segura"
```

- No diretório apps/web, crie um arquivo .env e adicione:

```
VITE_API_URL="http://localhost:3333"
VITE_TMDB_API_KEY="sua_chave_do_tmdb_aqui"
```

#### 4. Configure o Banco de Dados (Prisma)

Navegue até a pasta da API e crie as tabelas no banco de dados:

```bash
cd apps/api
npx prisma db push
# ou npx prisma migrate dev
```

#### 5. Inicie o servidor de desenvolvimento

Volte para a raiz do projeto e rode o comando principal:

```bash
pnpm dev
```
Este comando iniciará simultaneamente o Backend (porta 3333) e o Frontend (porta 5173).

#### Feito com 💚 e 🍿 no ecossistema TypeScript.
