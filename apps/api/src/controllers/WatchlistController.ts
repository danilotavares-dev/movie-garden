import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { prisma } from '@/lib/prisma'

export async function addToWatchlist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    mediaId: z.number(),
    title: z.string(),
    posterPath: z.string().optional(),
    mediaType: z.string(),
  })

  const { mediaId, title, posterPath, mediaType } = bodySchema.parse(
    request.body,
  )

  const { sub: userId } = request.user as { sub: string }

  try {
    await prisma.watchlist.create({
      data: {
        userId,
        mediaId,
        title,
        poster: posterPath,
        mediaType,
      },
    })
    return reply.status(201).send()
  } catch (error) {
    return reply.status(409).send({ message: 'Item já está na lista.' })
  }
}

export async function removeFromWatchlist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('Tentando Remover item...')

  const paramsSchema = z.object({
    mediaId: z.string().transform((v) => Number(v)),
  })

  const { mediaId } = paramsSchema.parse(request.params)
  const { sub: userId } = request.user as { sub: string }

  console.log(`Usuario: ${userId}, Filme: ${mediaId}`)

  try {
    await prisma.watchlist.deleteMany({
      where: {
        userId,
        mediaId,
      },
    })

    console.log('Item removido com sucesso!')
    return reply.status(204).send()
  } catch (error) {
    console.error('ERRO AO REMOVER:', error)
    return reply.status(500).send({ message: 'Erro interno ao remover.' })
  }
}

export async function checkStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    mediaId: z.string().transform(Number),
  })

  const { mediaId } = paramsSchema.parse(request.params)
  const { sub: userId } = request.user as { sub: string }

  const item = await prisma.watchlist.findFirst({
    where: {
      userId,
      mediaId,
    },
  })

  return reply.send({ isInList: !!item })
}

export async function getWatchlist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub: userId } = request.user as { sub: string }
    console.log('🔍 Buscando lista para o usuário:', userId)

    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log('✅ Itens encontrados:', watchlist.length)
    return reply.send(watchlist)
  } catch (error) {
    console.error('🚨 ERRO GRAVE NO GETWATCHLIST:', error)
    return reply
      .status(500)
      .send({ message: 'Erro ao buscar lista', error: String(error) })
  }
}
