'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export function MagazineRegisterForm() {
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in name, email, and password.')
      return
    }
    if (password.length < 6) {
      setError('Use at least 6 characters for your password.')
      return
    }
    try {
      await signup(name.trim(), email.trim(), password)
      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200/90 bg-white p-8 shadow-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">New account</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">Create your reader profile</h2>
      <p className="mt-2 text-sm text-slate-600">
        Save your place across articles, follow writers, and manage preferences. Your account is stored locally in the browser after sign-up
        in this demo environment.
      </p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="reg-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 focus:border-[#1a9b8f] focus:ring-4"
            placeholder="Jordan Lee"
          />
        </div>
        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 focus:border-[#1a9b8f] focus:ring-4"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="reg-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm outline-none ring-[#1a9b8f]/30 focus:border-[#1a9b8f] focus:ring-4"
            placeholder="At least 6 characters"
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
              Creating account…
            </>
          ) : (
            <>
              <PenLine className="mr-2 h-4 w-4" />
              Create account
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-[#0c6b62] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
