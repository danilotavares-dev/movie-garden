import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { prisma } from '@/lib/prisma'

const paramsSchema = z.object({
  mediaId: z.coerce.number().int().positive(),
  mediaType: z.enum(['movie', 'tv']),
})

const getUserId = (request: FastifyRequest) =>
  (request.user as { sub: string }).sub

export async function getMediaCommunity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { mediaId, mediaType } = paramsSchema.parse(request.params)
  const userId = getUserId(request)

  const [ratings, userRating, messages] = await Promise.all([
    prisma.rating.aggregate({
      where: { mediaId, mediaType },
      _avg: { value: true },
      _count: { value: true },
    }),
    prisma.rating.findUnique({
      where: { userId_mediaId_mediaType: { userId, mediaId, mediaType } },
      select: { value: true },
    }),
    prisma.mediaMessage.findMany({
      where: { mediaId, mediaType },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { name: true } } },
    }),
  ])

  return reply.send({
    averageRating: ratings._avg.value ?? 0,
    ratingCount: ratings._count.value,
    userRating: userRating?.value ?? 0,
    messages: messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      userName: message.user.name,
    })),
  })
}

export async function rateMedia(request: FastifyRequest, reply: FastifyReply) {
  const { mediaId, mediaType } = paramsSchema.parse(request.params)
  const { value } = z
    .object({ value: z.number().int().min(1).max(5) })
    .parse(request.body)

  const rating = await prisma.rating.upsert({
    where: {
      userId_mediaId_mediaType: {
        userId: getUserId(request),
        mediaId,
        mediaType,
      },
    },
    update: { value },
    create: {
      userId: getUserId(request),
      mediaId,
      mediaType,
      value,
    },
  })

  const summary = await prisma.rating.aggregate({
    where: { mediaId, mediaType },
    _avg: { value: true },
    _count: { value: true },
  })

  return reply.send({
    value: rating.value,
    averageRating: summary._avg.value ?? 0,
    ratingCount: summary._count.value,
  })
}

export async function addMediaMessage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { mediaId, mediaType } = paramsSchema.parse(request.params)
  const { content } = z
    .object({ content: z.string().trim().min(1).max(500) })
    .parse(request.body)

  const message = await prisma.mediaMessage.create({
    data: {
      userId: getUserId(request),
      mediaId,
      mediaType,
      content,
    },
    include: { user: { select: { name: true } } },
  })

  return reply.status(201).send({
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    userName: message.user.name,
  })
}
