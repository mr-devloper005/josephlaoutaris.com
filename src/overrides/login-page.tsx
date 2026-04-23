'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Loader2 } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { ContentImage } from '@/components/shared/content-image'

export const LOGIN_PAGE_OVERRIDE_ENABLED = true

export function LoginPageOverride() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    try {
      await login(email.trim(), password)
      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] shadow-lg lg:min-h-[480px]">
            <ContentImage
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062c2a]/95 via-[#062c2a]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <FileText className="h-10 w-10 text-[#7ee0d3]" />
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, reader</h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                Sign in to save articles, follow profiles, and pick up where you left off. Your session is stored on this device after a successful login.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Account</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-600">Use any email and password to try the demo. Successful sign-in is saved locally in your browser.</p>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 transition-shadow focus:border-[#1a9b8f] focus:ring-4"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 transition-shadow focus:border-[#1a9b8f] focus:ring-4"
                  placeholder="••••••••"
                />
              </div>
              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 rounded-full bg-[#1a9b8f] text-base font-semibold text-white hover:bg-[#158a7f] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <Link href="/forgot-password" className="font-medium text-[#0c6b62] hover:underline">
                Forgot password?
              </Link>
              <Link href="/register" className="font-semibold text-[#0c6b62] hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
