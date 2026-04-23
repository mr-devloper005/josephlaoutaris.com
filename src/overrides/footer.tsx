import Link from 'next/link'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'

export const FOOTER_OVERRIDE_ENABLED = true

const pages = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Profiles', href: '/profile' },
  { name: 'About', href: '/about' },
]

const legal = [
  { name: 'Terms of Use', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Cookie Policy', href: '/cookies' },
]

const social = [
  { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'YouTube', href: 'https://youtube.com', icon: Youtube },
]

export function FooterOverride() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#062c2a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 p-1">
                <img src="/favicon.png?v=20260401" alt="" width={40} height={40} className="h-9 w-9 rounded-full object-contain" />
              </div>
              <span className="text-lg font-semibold">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">{SITE_CONFIG.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/50">Get the app</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80">App Store</span>
              <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80">Google Play</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#5ec4b8]">Our pages</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              {pages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#5ec4b8]">Legal &amp; policy</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#5ec4b8]">Follow us</h3>
            <div className="mt-4 flex gap-3">
              {social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/90 transition-colors hover:bg-[#1a9b8f] hover:text-white"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/55">
          &copy; {year} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
