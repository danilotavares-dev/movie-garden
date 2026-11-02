import type { FastifyReply, FastifyRequest } from 'fastify'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  createPasswordResetToken,
  hashPasswordResetToken,
} from '@/lib/password-reset'
import { createMailer } from '@/lib/mailer'

const requestSchema = z.object({
  email: z.string().email(),
})

const resetSchema = z.object({
  token: z.string().length(64),
  password: z.string().min(6),
})

const genericResponse = {
  message:
    'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.',
}

export function createPasswordResetController(config: {
  frontendUrl: string
  mailer?: ReturnType<typeof createMailer>
}) {
  return {
    async requestReset(request: FastifyRequest, reply: FastifyReply) {
      if (!config.mailer) {
        return reply.status(503).send({
          message:
            'A recuperação de senha está indisponível porque o SMTP não foi configurado.',
        })
      }

      const { email } = requestSchema.parse(request.body)
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        return reply.status(202).send(genericResponse)
      }

      try {
        const { token, tokenHash, expiresAt } = createPasswordResetToken()

        await prisma.passwordResetToken.deleteMany({
          where: { userId: user.id },
        })
        await prisma.passwordResetToken.create({
          data: { userId: user.id, tokenHash, expiresAt },
        })

        const resetUrl = `${config.frontendUrl}/redefinir-senha?token=${token}`
        await config.mailer.sendPasswordResetEmail(user.email, resetUrl, 60)
      } catch (error) {
        console.error('Password reset request failed:', error)
        await prisma.passwordResetToken.deleteMany({
          where: { userId: user.id },
        })
        return reply.status(503).send({
          message:
            'Não foi possível processar a recuperação. Verifique o banco de dados e a configuração SMTP da API.',
        })
      }

      return reply.status(202).send(genericResponse)
    },

    async resetPassword(request: FastifyRequest, reply: FastifyReply) {
      const { token, password } = resetSchema.parse(request.body)
      const tokenHash = hashPasswordResetToken(token)
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { tokenHash },
      })

      if (
        !resetToken ||
        resetToken.usedAt ||
        resetToken.expiresAt.getTime() <= Date.now()
      ) {
        return reply
          .status(400)
          .send({ message: 'O link de recuperação é inválido ou expirou.' })
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: resetToken.userId },
          data: { password: await hash(password, 10) },
        }),
        prisma.passwordResetToken.update({
          where: { id: resetToken.id },
          data: { usedAt: new Date() },
        }),
      ])

      return reply.send({ message: 'Senha redefinida com sucesso.' })
    },
  }
}
