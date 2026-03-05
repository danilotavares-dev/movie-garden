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

### 🔴 Project Status: Active Development (Work in Progress). Core catalog, library, and AI recommendation engine features are functional, but review features are still being refined.

> Your personal garden for movies and series. Discover, save, and get smart recommendations based on your taste.

**Movie Garden** is a full-stack web application built with a modern **Monorepo** architecture. It consumes the TMDB API for a rich media catalog and utilizes Artificial Intelligence to suggest content based on user descriptions and preferences.

## Preview
![Home Page](assets/inicial.png)
![Catalog Page](assets/catalogo.gif)

## Features

- **Dynamic Catalog:** Trending, highly-rated, and recommended movies and series, consuming the TMDB API.
- **AI-Powered Search:** Don't know the name of the movie? Describe what you want to watch, and the AI recommends the best titles.
- **My Library (Watchlist):** Save your favorite movies and series to watch later.
- **Optimistic UI:** Instant visual feedback when saving movies to your library.
- **Internationalization (i18n):** Native support for Portuguese (PT-BR), English (EN-US), and Spanish (ES).
- **Secure Authentication:** JWT-protected user login and registration.
- **Custom Design System:** Reusable UI components isolated in a dedicated package (`@movie-garden/ui`).

## Technologies Used

This project utilizes a modern ecosystem focused on performance and end-to-end static typing.

**Frontend (`apps/web`):**
- React (with Vite)
- TypeScript
- Tailwind CSS (Styling)
- React Router DOM (Navigation)
- Axios (HTTP Requests)
- i18next (Multi-language support)

**Backend (`apps/api`):**
- Node.js
- Fastify (Blazing fast web framework)
- Prisma ORM (Database)
- PostgreSQL (Relational database)
- Zod (Data validation)
- JWT (JSON Web Tokens for authentication)

**Architecture & Tools:**
- Monorepo (pnpm workspaces / Turborepo)
- ESLint & Prettier

## Monorepo Structure

The project is divided into the following main areas:

```text
projeto-movie-garden/
├── apps/
│   ├── api/          # Backend (Fastify + Prisma)
│   ├── ml-engine/    # AI Engine (Python, Gemini)
│   └── web/          # Frontend (React + Vite)
├── packages/
│   └── ui/           # Component Library (Tailwind + React)
└── package.json
```

## How to Run the Project Locally

### Prerequisites

Before you begin, you will need to have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (package manager)
- A running PostgreSQL database (local or cloud)
- A **TMDB (The Movie Database)** API key

---

### Step-by-Step Guide

#### 1. Clone the repository

```bash
git clone [https://github.com/SEU_USUARIO/projeto-movie-garden.git](https://github.com/SEU_USUARIO/projeto-movie-garden.git)
cd projeto-movie-garden
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Configure Environment Variables

- In the apps/api directory, create a .env file and add:

```
DATABASE_URL="postgresql://user:password@localhost:5432/movie_garden"
JWT_SECRET="your_super_secure_secret_key"
```

- In the apps/web directory, create a .env file and add:

```
VITE_API_URL="http://localhost:3333"
VITE_TMDB_API_KEY="your_tmdb_api_key_here"
```

#### 4. Configure the Database (Prisma)

Navigate to the API folder and create the database tables:

```bash
cd apps/api
npx prisma db push
# or npx prisma migrate dev
```

#### 5. Start the development server

Go back to the project root and run the main command:

```bash
pnpm dev
```
This command will concurrently start the Backend (port 3333) and the Frontend (port 5173).

#### Made with 💚 and 🍿 in the TypeScript ecosystem.
