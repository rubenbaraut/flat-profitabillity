import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@supabase/auth-helpers-react'
import AuthComponent from '../components/Auth'

const LoginPage = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
        </div>
        <AuthComponent />
      </div>
    </div>
  )
}

export default LoginPage

