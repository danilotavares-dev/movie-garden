# API do Movie Garden

## Convenções

- URL local: `http://localhost:3333/api`;
- respostas e mensagens são JSON, salvo `204 No Content`;
- rotas marcadas como protegidas exigem `Authorization: Bearer <JWT>`;
- `mediaType` aceito pela comunidade é `movie` ou `tv`;
- erros de validação retornam `400`; credenciais inválidas retornam `400`; ausência de autenticação retorna `401`.

## Saúde e autenticação

### `GET /api/health`

Retorna `{ "status": "ok" }`.

### `POST /api/users`

Cria uma conta.

```json
{
  "name": "Nome da pessoa",
  "email": "pessoa@example.com",
  "password": "no-minimo-6-caracteres"
}
```

Resposta `201`:

```json
{ "userId": "uuid", "message": "Usuário criado com sucesso!" }
```

### `POST /api/login`

Autentica uma conta.

```json
{ "email": "pessoa@example.com", "password": "senha" }
```

Resposta `200`:

```json
{ "userId": "uuid", "token": "jwt", "message": "Login realizado com sucesso!." }
```

## Recomendações

### `POST /api/recommendations` — protegido

```json
{
  "movieTitle": "ficção científica com viagem no tempo",
  "userPreferences": "prefiro histórias curtas e sem violência explícita"
}
```

A API encaminha o pedido ao motor Python e devolve a lista gerada pelo serviço. A resposta esperada contém itens com `title`, `mediaType` (`movie` ou `tv`) e `reason`.

## Watchlist

### `GET /api/watchlist` — protegido

Lista os itens do usuário, do mais recente para o mais antigo.

### `POST /api/watchlist` — protegido

```json
{
  "mediaId": 123,
  "title": "Título",
  "posterPath": "/poster.jpg",
  "mediaType": "movie"
}
```

Retorna `201`. Duplicata retorna `409`.

### `DELETE /api/watchlist/:mediaId` — protegido

Remove o item do usuário. Retorna `204`.

### `GET /api/watchlist/:mediaId/status` — protegido

Retorna `{ "isInList": true }` ou `{ "isInList": false }`.

## Comunidade

### `GET /api/media/:mediaType/:mediaId/community` — protegido

Retorna a média, a quantidade de avaliações, a avaliação do usuário autenticado e até 50 mensagens recentes:

```json
{
  "averageRating": 4.5,
  "ratingCount": 12,
  "userRating": 5,
  "messages": [
    {
      "id": "uuid",
      "content": "Comentário",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "userName": "Nome"
    }
  ]
}
```

### `PUT /api/media/:mediaType/:mediaId/rating` — protegido

Recebe `{ "value": 1 }` até `{ "value": 5 }`. A mesma pessoa atualiza a própria avaliação por upsert.

### `POST /api/media/:mediaType/:mediaId/messages` — protegido

Recebe `{ "content": "Mensagem entre 1 e 500 caracteres" }` e retorna a mensagem criada com o nome do autor.

## Exemplo com cURL

```bash
TOKEN="cole-um-token-apenas-no-seu-terminal"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3333/api/watchlist
```

Nunca coloque tokens reais em scripts versionados, documentação publicada ou logs.
