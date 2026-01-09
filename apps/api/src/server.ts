import fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const app = fastify()
const prisma = new PrismaClient()

app.register(cors, {
  origin: '*',
})

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
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

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server runnning on http://localhost:3333')
})
