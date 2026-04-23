import Link from 'next/link'
import { Check, Newspaper } from 'lucide-react'
import { MagazineShell, MagazineContentSection, MagazinePageHeader } from '@/components/magazine/magazine-shell'
import { MagazineRegisterForm } from '@/components/magazine/magazine-register-form'
import { ContentImage } from '@/components/shared/content-image'
import { SITE_CONFIG } from '@/lib/site-config'

const perks = [
  'Bookmark articles and return on any device with your saved session',
  'Optional writer tools when you are ready to pitch or publish',
  'Same calm teal experience as the rest of the magazine site',
]

export default function RegisterPage() {
  return (
    <MagazineShell
      hero={
        <MagazinePageHeader
          eyebrow="Join"
          title="Create your account"
          description={`Set up a free ${SITE_CONFIG.name} profile to follow stories, save your place, and get in touch with the desk when you are ready to contribute.`}
        />
      }
    >
      <MagazineContentSection className="!py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="space-y-8">
            <div className="relative min-h-[260px] overflow-hidden rounded-[2rem] shadow-lg lg:min-h-[320px]">
              <ContentImage
                src="https://images.unsplash.com/photo-1524995997946-a1c024e0a646?auto=format&fit=crop&w=1200&q=80"
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062c2a]/90 via-[#062c2a]/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <Newspaper className="h-9 w-9 text-[#a8ebe3]" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight">Readers and writers welcome</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
                  One account for the article library and the profile directory—no separate “consumer” vs “creator” silos.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">What you get</p>
              <ul className="mt-4 space-y-3">
                {perks.map((line) => (
                  <li key={line} className="flex gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e0f5f2] text-[#0c3d3a]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-slate-500">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="font-semibold text-[#0c6b62] hover:underline">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-semibold text-[#0c6b62] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <MagazineRegisterForm />
        </div>
      </MagazineContentSection>
    </MagazineShell>
  )
}
