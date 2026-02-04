import { FastifyReply, FastifyRequest } from 'fastify'
import axios from 'axios'
import { z } from 'zod'

export async function getRecommendations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const recommendationBodySchema = z.object({
    movieTitle: z.string(),
    userPreferences: z.string().optional().default(''),
  })

  const { movieTitle, userPreferences } = recommendationBodySchema.parse(
    request.body,
  )

  try {
    const response = await axios.post('http://127.0.0.1:8000/recommend', {
      movie_title: movieTitle,
      user_preferences: userPreferences,
    })

    return reply.status(200).send(response.data.data)
  } catch (error) {
    console.error('Erro ao conectar com ML Engine:', error)

    return reply.status(503).send({
      message:
        'O serviço de inteligência artificial está indisponível no momento.',
    })
  }
}
