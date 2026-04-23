import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

type MagazineShellProps = {
  children: ReactNode
  /** Full-width block below navbar (e.g. hero strip) */
  hero?: ReactNode
}

export function MagazineShell({ children, hero }: MagazineShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900 antialiased">
      <NavbarShell />
      {hero}
      {children}
      <Footer />
    </div>
  )
}

export function MagazinePageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="border-b border-slate-200/80 bg-gradient-to-br from-[#0c3d3a] via-[#0f524c] to-[#1a7a72] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8ebe3]">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85">{description}</p> : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  )
}

export function MagazineContentSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 ${className}`}>{children}</div>
}
