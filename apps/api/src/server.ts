import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
import fastify, { type FastifyInstance } from 'fastify'
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
import { createPasswordResetController } from './controllers/password-reset.controller'
import { createMailer } from './lib/mailer'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  PORT: z.coerce.number().int().positive().default(3333),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  AI_ENGINE_URL: z.string().url().default('http://127.0.0.1:8000'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .string()
    .optional()
    .default('false')
    .transform((value) => value.toLowerCase() === 'true'),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASSWORD: z.string().min(1).optional(),
  SMTP_FROM: z.string().min(1).optional(),
})

const env = envSchema.parse(process.env)
const app = fastify()
const prisma = new PrismaClient()
const smtpConfig =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM
    ? {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        user: env.SMTP_USER,
        password: env.SMTP_PASSWORD,
        from: env.SMTP_FROM,
      }
    : undefined
const passwordReset = createPasswordResetController({
  frontendUrl: env.FRONTEND_URL,
  mailer: smtpConfig ? createMailer(smtpConfig) : undefined,
})

app.register(cors, {
  origin: env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
})

app.register(jwt, {
  secret: env.JWT_SECRET,
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

async function registerApiRoutes(api: FastifyInstance) {
  api.get('/health', async () => ({ status: 'ok' }))

  api.post('/users', async (request, reply) => {
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

  api.post('/login', async (request, reply) => {
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

  api.post('/password-reset/request', passwordReset.requestReset)
  api.post('/password-reset/confirm', passwordReset.resetPassword)

  api.post('/recommendations', { onRequest: [verifyJwt] }, getRecommendations)

  api.post('/watchlist', { onRequest: [verifyJwt] }, addToWatchlist)
  api.delete(
    '/watchlist/:mediaId',
    { onRequest: [verifyJwt] },
    removeFromWatchlist,
  )
  api.get('/watchlist/:mediaId/status', { onRequest: [verifyJwt] }, checkStatus)

  api.get('/watchlist', { onRequest: [verifyJwt] }, getWatchlist)

  api.get(
    '/media/:mediaType/:mediaId/community',
    { onRequest: [verifyJwt] },
    getMediaCommunity,
  )
  api.put(
    '/media/:mediaType/:mediaId/rating',
    { onRequest: [verifyJwt] },
    rateMedia,
  )
  api.post(
    '/media/:mediaType/:mediaId/messages',
    { onRequest: [verifyJwt] },
    addMediaMessage,
  )
}

app.register(registerApiRoutes, { prefix: '/api' })

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`HTTP Server running on port ${env.PORT}`)
  })
  .catch(async (error) => {
    app.log.error(error, 'Could not start HTTP server')
    await prisma.$disconnect()
    process.exit(1)
  })
