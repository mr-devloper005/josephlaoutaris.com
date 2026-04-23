'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  ssr: false,
  loading: () => null,
})

export const NAVBAR_OVERRIDE_ENABLED = true

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Profiles', href: '/profile' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function NavbarOverride() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onHomeHero = pathname === '/'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        solid || !onHomeHero
          ? 'border-b border-teal-900/40 bg-[#0c3d3a]/95 text-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md'
          : 'border-b border-white/10 bg-[#0c3d3a]/55 text-white backdrop-blur-md',
      )}
    >
      <nav className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 p-1">
            <img src="/favicon.png?v=20260401" alt="" width={36} height={36} className="h-8 w-8 rounded-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-tight">{SITE_CONFIG.name}</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 sm:block">Articles &amp; profiles</span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  active ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <NavbarAuthControls />
          ) : (
            <>
              <Button size="sm" asChild className="hidden rounded-full border-0 bg-[#1a9b8f] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#158a7f] md:inline-flex">
                <Link href="/register">Subscribe</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="hidden rounded-full border-white/70 bg-transparent px-5 text-sm font-semibold text-white hover:bg-white/10 hover:text-white md:inline-flex"
              >
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 lg:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#0c3d3a] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <div className="mt-3 flex flex-col gap-2">
                <Button asChild className="rounded-full bg-[#1a9b8f] text-white hover:bg-[#158a7f]">
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Subscribe
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/60 text-white hover:bg-white/10">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
