import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcryptjs'
import { getRecommendations } from './controllers/recommendation.controller'
import { verifyJwt } from './middlewares/verify-jwt'
import {
  addMediaMessage,
  getMediaCommunity,
  rateMedia,
} from './controllers/MediaCommunityController'
import {
  addToWatchlist,
  removeFromWatchlist,
  checkStatus,
  getWatchlist,
} from './controllers/WatchlistController'

const app = fastify()
const prisma = new PrismaClient()

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
})

app.register(jwt, {
  secret: 'movie-garden-secret-key-123',
})

app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, 'Request failed')

  if (error instanceof z.ZodError) {
    return reply.status(400).send({ message: 'Verifique os dados informados.' })
  }

  return reply
    .status(500)
    .send({ message: 'Não foi possível concluir a operação.' })
})

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userAlreadyExists) {
      return reply
        .status(409)
        .send({ message: 'Este e-mail já está cadastrado.' })
    }

    const passwordHash = await hash(password, 6)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })

    return reply.status(201).send({
      userId: user.id,
      message: 'Usuário criado com sucesso!',
    })
  } catch (error) {
    request.log.error({ err: error }, 'Could not create user')
    return reply.status(503).send({
      message:
        'Não foi possível criar a conta agora. Tente novamente mais tarde.',
    })
  }
})

app.post('/login', async (request, reply) => {
  const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = loginBodySchema.parse(request.body)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return reply.status(400).send({ message: 'E-mail ou senha inválido(s).' })
  }

  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    return reply.status(400).send({ message: 'E-mail ou senha inválido(s).' })
  }

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
      },
    },
  )

  return reply.status(200).send({
    userId: user.id,
    token,
    message: 'Login realizado com sucesso!.',
  })
})

app.post('/recommendations', { onRequest: [verifyJwt] }, getRecommendations)

app.post('/watchlist', { onRequest: [verifyJwt] }, addToWatchlist)
app.delete(
  '/watchlist/:mediaId',
  { onRequest: [verifyJwt] },
  removeFromWatchlist,
)
app.get('/watchlist/:mediaId/status', { onRequest: [verifyJwt] }, checkStatus)

app.get('/watchlist', { onRequest: [verifyJwt] }, getWatchlist)

app.get(
  '/media/:mediaType/:mediaId/community',
  { onRequest: [verifyJwt] },
  getMediaCommunity,
)
app.put(
  '/media/:mediaType/:mediaId/rating',
  { onRequest: [verifyJwt] },
  rateMedia,
)
app.post(
  '/media/:mediaType/:mediaId/messages',
  { onRequest: [verifyJwt] },
  addMediaMessage,
)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server runnning on http://localhost:3333')
})
