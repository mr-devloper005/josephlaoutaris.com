import Link from 'next/link'
import { ArrowRight, Feather, HeartHandshake, Lightbulb, Mail, Target, Users } from 'lucide-react'
import { MagazineShell, MagazineContentSection, MagazinePageHeader } from '@/components/magazine/magazine-shell'
import { Button } from '@/components/ui/button'
import { ContentImage } from '@/components/shared/content-image'
import { SITE_CONFIG } from '@/lib/site-config'

const pillars = [
  {
    title: 'Editorial clarity',
    body: 'We publish work that earns your time—clear arguments, honest context, and reporting that respects the reader.',
    icon: Feather,
  },
  {
    title: 'People first',
    body: 'Profiles are not afterthoughts. They sit beside articles so you can follow a voice, not just a headline.',
    icon: Users,
  },
  {
    title: 'Measured pace',
    body: 'The layout is intentionally calm: fewer gimmicks, more room for photography, pull quotes, and long-form depth.',
    icon: Lightbulb,
  },
]

const milestones = [
  { year: '2024', text: 'Launched a focused reading surface for articles and contributor profiles.' },
  { year: '2025', text: 'Expanded topic lanes, improved search, and refined mobile typography.' },
  { year: '2026', text: 'Doubled down on accessibility, local voices, and transparent reader policies.' },
]

export default function AboutPage() {
  return (
    <MagazineShell
      hero={
        <MagazinePageHeader
          eyebrow="About us"
          title={`Inside ${SITE_CONFIG.name}`}
          description="We are an articles-and-profiles publication: one place for thoughtful writing and the people who make it—without the noise of generic social feeds or marketplace clutter."
          actions={
            <>
              <Button asChild className="rounded-full bg-[#1a9b8f] px-6 text-white hover:bg-[#158a7f]">
                <Link href="/articles">Read articles</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/50 bg-white/10 text-white backdrop-blur hover:bg-white/15"
              >
                <Link href="/contact">Contact the desk</Link>
              </Button>
            </>
          }
        />
      }
    >
      <MagazineContentSection className="!py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] shadow-lg lg:min-h-[360px]">
            <ContentImage
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80"
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#062c2a]/40 to-transparent" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Mission</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Stories that travel—and voices that stay with you</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              {SITE_CONFIG.name} exists to support slow journalism and sharp profiles. We care about craft: ledes that land, edits that
              tighten without flattening, and art direction that feels like part of the story—not decoration layered on top.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Whether you arrive through a bookmarked essay or a profile that caught your eye, the experience should feel coherent:
              same palette, same rhythm, same respect for your attention.
            </p>
            <Link
              href="/profile"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0c6b62] hover:underline"
            >
              Meet our contributors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </MagazineContentSection>

      <section className="border-y border-slate-200/80 bg-white py-14">
        <MagazineContentSection className="!py-0">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map(({ title, body, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200/90 bg-[#f6f8f7] p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0c3d3a] text-[#a8ebe3]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </MagazineContentSection>
      </section>

      <MagazineContentSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">How we work</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Editorial standards you can expect</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#1a9b8f]" />
                <span>
                  <strong className="text-slate-900">Accuracy:</strong> we correct errors promptly and show update notes when a story
                  materially changes after publication.
                </span>
              </li>
              <li className="flex gap-3">
                <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-[#1a9b8f]" />
                <span>
                  <strong className="text-slate-900">Independence:</strong> sponsored or partner content is labeled clearly and never
                  disguised as newsroom reporting.
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#1a9b8f]" />
                <span>
                  <strong className="text-slate-900">Open door:</strong> tips, fact-checks, and good-faith criticism belong in our inbox—
                  <Link href="/contact" className="font-semibold text-[#0c6b62] hover:underline">
                    contact us
                  </Link>
                  .
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#e8faf8] to-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Milestones</p>
            <div className="mt-6 space-y-6">
              {milestones.map((m) => (
                <div key={m.year} className="border-l-2 border-[#1a9b8f] pl-5">
                  <p className="text-sm font-bold text-[#0c3d3a]">{m.year}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MagazineContentSection>

      <section className="border-t border-slate-200/80 bg-[#0c3d3a] py-16 text-white">
        <MagazineContentSection className="!py-0">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Want to write with us?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                Send a short bio, three clips, and the kind of stories you hope to tell. We read every serious pitch—even when we cannot
                reply immediately.
              </p>
            </div>
            <Button asChild className="rounded-full bg-white px-8 text-[#0c3d3a] hover:bg-[#e8faf8]">
              <Link href="/register">Create an account</Link>
            </Button>
          </div>
        </MagazineContentSection>
      </section>
    </MagazineShell>
  )
}
