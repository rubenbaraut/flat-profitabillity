import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // limitar cada IP a 5 solicitudes por ventana
})

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await limiter(req, res)
    } catch {
      return res.status(429).json({ error: 'Demasiadas solicitudes, por favor intente más tarde' })
    }

    const { name, email, subject, message, recaptchaValue } = req.body

    // Verificar reCAPTCHA
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`,
      { method: 'POST' }
    )
    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success) {
      return res.status(400).json({ error: 'reCAPTCHA inválido' })
    }

    try {
      await transporter.sendMail({
        from: email,
        to: 'hola@trucosdericos.com',
        subject: `Nuevo mensaje de contacto: ${subject}`,
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
        html: `<p><strong>Nombre:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Mensaje:</strong> ${message}</p>`,
      })

      res.status(200).json({ message: 'Email enviado con éxito' })
    } catch (error) {
      res.status(500).json({ error: 'Error al enviar el email' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

