import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const AuthComponent = () => {
  const supabase = useSupabaseClient()

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      providers={['google', 'facebook']}
    />
  )
}

export default AuthComponent

