import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcryptjs'
import { getRecommendations } from './controllers/recommendation.controller'
import { verifyJwt } from './middlewares/verify-jwt'

const app = fastify()
const prisma = new PrismaClient()

app.register(cors, {
  origin: '*',
})

app.register(jwt, {
  secret: 'movie-garden-secret-key-123',
})

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const userAlreadyExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userAlreadyExists) {
    return reply.status(409).send({ message: 'E-mail already exists.' })
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

app.post('/recommendations', getRecommendations)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server runnning on http://localhost:3333')
})
