import nodemailer from 'nodemailer'

type MailerConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  from: string
}

export function createMailer(config: MailerConfig) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  })

  return {
    async sendPasswordResetEmail(
      recipient: string,
      resetUrl: string,
      expiresInMinutes: number,
    ) {
      await transporter.sendMail({
        from: config.from,
        to: recipient,
        subject: 'Redefina sua senha do Movie Garden',
        text: [
          'Recebemos uma solicitação para redefinir sua senha do Movie Garden.',
          '',
          `Use este link dentro de ${expiresInMinutes} minutos:`,
          resetUrl,
          '',
          'Se você não fez essa solicitação, ignore este e-mail.',
        ].join('\n'),
        html: `
          <p>Recebemos uma solicitação para redefinir sua senha do Movie Garden.</p>
          <p><a href="${resetUrl}">Redefinir minha senha</a></p>
          <p>Este link expira em ${expiresInMinutes} minutos.</p>
          <p>Se você não fez essa solicitação, ignore este e-mail.</p>
        `,
      })
    },
  }
}
