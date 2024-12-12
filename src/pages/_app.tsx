import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/" className="flex items-center">
                  <img 
                    src="/img/logo.png" 
                    alt="Trucos de Ricos" 
                    className="h-16 w-auto" 
                  />
                </Link>
              </div>
              <nav className="hidden md:flex space-x-10">
                <Link href="/tools" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Herramientas
                </Link>
                <Link href="/blog" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Blog
                </Link>
                <Link href="https://anchor.fm/ruben8022" className="text-base font-medium text-gray-500 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                  Podcast
                </Link>
                <Link href="/contacto" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Contacto
                </Link>
                <Link href="/login" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Iniciar sesión
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2024 Trucos de Ricos. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </SessionContextProvider>
  )
}

