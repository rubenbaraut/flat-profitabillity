import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { toast } from "../components/ui/use-toast"
import ReCAPTCHA from "react-google-recaptcha"

type FormData = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    if (!recaptchaValue) {
      toast({
        title: "Error",
        description: "Por favor, completa el reCAPTCHA",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaValue }),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Tu mensaje ha sido enviado correctamente",
        })
        reset()
      } else {
        throw new Error('Error al enviar el mensaje')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-10 bg-gray-200">
      <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-5 text-gray-900">Contacto</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <Input
              id="name"
              {...register("name", { required: "El nombre es obligatorio" })}
              className="mt-1"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              id="email"
              type="email"
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de email inválida"
                }
              })}
              className="mt-1"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
            <Input
              id="subject"
              {...register("subject", { required: "El asunto es obligatorio" })}
              className="mt-1"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
            <Textarea
              id="message"
              {...register("message", { required: "El mensaje es obligatorio" })}
              className="mt-1"
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
          </div>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={setRecaptchaValue}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold">
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  )
}

