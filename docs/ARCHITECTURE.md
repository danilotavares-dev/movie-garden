# Arquitetura do Movie Garden

## Visão geral

O projeto é um monorepo `pnpm` com três aplicações e um pacote compartilhado:

- `apps/web`: interface React/Vite;
- `apps/api`: API HTTP Fastify;
- `apps/ai-engine`: serviço FastAPI que chama o Gemini;
- `packages/ui`: componentes visuais reutilizáveis.

O frontend conversa diretamente com o TMDB para dados públicos de catálogo e com a API própria para dados de usuário. A API é a única camada que acessa o PostgreSQL e encaminha pedidos de recomendação para o serviço Python.

## Responsabilidades por camada

### Web

As rotas são definidas em [`App.tsx`](../apps/web/src/App.tsx). A página inicial, login e cadastro são públicas. Catálogo e biblioteca passam por `PrivateRoute`; detalhes de filmes e séries são acessíveis pelas rotas `/movie/:id` e `/serie/:id`.

[`services/tmdb.ts`](../apps/web/src/services/tmdb.ts) encapsula as chamadas ao TMDB. [`services/api.ts`](../apps/web/src/services/api.ts) configura o Axios, adiciona o JWT e agrupa os serviços de watchlist e comunidade.

O catálogo coordena:

- seções de tendências, populares, mais bem avaliados, lançamentos e séries em exibição;
- busca paginada de filmes e séries;
- painel de recomendação por IA;
- hidratação das sugestões da IA com dados do TMDB;
- troca de idioma;
- navegação para detalhes e ações de biblioteca.

### API

[`server.ts`](../apps/api/src/server.ts) valida variáveis de ambiente com Zod, registra CORS/JWT, cria o cliente Prisma e monta todas as rotas sob `/api`.

- autenticação: criação de usuário, login e middleware JWT;
- biblioteca: operações de watchlist por usuário;
- comunidade: média, contagem, avaliação individual e até 50 mensagens recentes;
- recomendações: proxy autenticado para o `ai-engine`.

Os controllers mantêm a validação de payload e parâmetros próxima da operação. A senha é armazenada como hash com `bcryptjs`; o JWT contém o identificador do usuário no `sub`.

### Motor de IA

[`main.py`](../apps/ai-engine/main.py) expõe:

- `GET /`: health check;
- `POST /recommend`: recebe um pedido e preferências, solicita exatamente nove títulos ao Gemini e devolve uma lista JSON.

O serviço não persiste dados. A API Node é responsável por autenticar o usuário e o frontend consulta o TMDB para transformar os títulos sugeridos em cards utilizáveis.

### Dados

O Prisma usa PostgreSQL. O schema possui:

- `User`: identidade e credenciais;
- `Watchlist`: itens salvos, únicos por usuário e mídia;
- `Rating`: nota de 1 a 5, única por usuário, mídia e tipo;
- `MediaMessage`: mensagem textual associada a uma mídia.
- `PasswordResetToken`: hash de um token temporário de recuperação, com expiração e marca de uso.

Filmes e séries não possuem tabela própria: `mediaId` e `mediaType` referenciam o catálogo externo do TMDB.

## Fluxos principais

### Login

1. O usuário envia e-mail e senha para `POST /api/login`.
2. A API compara a senha com o hash salvo.
3. A API devolve um JWT.
4. O frontend salva o token localmente e o Axios o envia no header `Authorization`.
5. `PrivateRoute` bloqueia as áreas privadas sem token.

### Watchlist

1. O card envia `mediaId`, título, pôster e tipo para a API.
2. A API associa o item ao usuário extraído do JWT.
3. O índice único evita duplicatas.
4. A interface atualiza o estado de forma otimista e pode sincronizar a biblioteca.

### Recomendação

1. O usuário descreve o que quer assistir no catálogo.
2. A API valida o pedido e encaminha `movie_title` e `user_preferences` ao Python.
3. O Gemini devolve JSON com `title`, `mediaType` e `reason`.
4. O frontend busca cada título no TMDB, descarta resultados não encontrados e renderiza os cards.

Esse desenho separa a chave do Gemini do navegador. A chave do TMDB, por decisão da integração atual, é usada no frontend e deve ser tratada como pública.

### Recuperação de senha

1. A pessoa informa o e-mail em `/esqueci-senha`.
2. A API responde com a mesma mensagem para e-mails existentes e inexistentes.
3. Para uma conta existente, a API cria um token aleatório de 32 bytes, persiste somente o hash SHA-256 e envia o token bruto por SMTP.
4. O link aponta para `/redefinir-senha?token=...` e expira em 60 minutos.
5. A nova senha é armazenada com bcrypt e o token é marcado como usado dentro de uma transação.

O token nunca é salvo em texto puro no banco. O envio é feito pelo servidor, e não pelo navegador, para que a credencial SMTP permaneça privada.

## Integrações e deploy

Em desenvolvimento, Docker fornece PostgreSQL e os três processos são iniciados separadamente. Em produção, [`vercel.json`](../vercel.json) declara os serviços `web`, `api` e `ai-engine`, além dos rewrites `/api/*` para a API.

Ao alterar uma integração externa, considere timeout, limites de uso, mensagens de erro, CORS e o comportamento quando o serviço estiver indisponível.
