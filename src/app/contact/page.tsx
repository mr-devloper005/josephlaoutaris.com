import { Clock, FileText, Mail, MapPin, MessageSquare, Sparkles, UserRound } from 'lucide-react'
import { MagazineShell, MagazineContentSection, MagazinePageHeader } from '@/components/magazine/magazine-shell'
import { MagazineContactForm } from '@/components/magazine/magazine-contact-form'
import { SITE_CONFIG } from '@/lib/site-config'

const lanes = [
  {
    icon: FileText,
    title: 'Editorial & pitches',
    body: 'Long-form ideas, reporting tips, and corrections on published pieces. Include links and deadlines when they matter.',
  },
  {
    icon: UserRound,
    title: 'Profiles & bios',
    body: 'Updates to your contributor profile, headshots, or focus areas—so readers always see the right version of your story.',
  },
  {
    icon: Sparkles,
    title: 'Partnerships',
    body: 'Newsletter sponsorships, cross-promotions, and live events. Tell us your audience and what success looks like.',
  },
]

export default function ContactPage() {
  return (
    <MagazineShell
      hero={
        <MagazinePageHeader
          eyebrow="Contact"
          title={`Talk to ${SITE_CONFIG.name}`}
          description="We read every message. Choose the lane that fits, then use the form—clear subject lines and context get faster replies."
        />
      }
    >
      <MagazineContentSection className="!py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {lanes.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c3d3a] text-[#a8ebe3]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-[#e8faf8] to-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0c6b62]">Desk hours</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#1a9b8f]" />
                  <span>
                    <strong className="text-slate-900">Mon–Thu</strong>, 9:00–17:00 local time for first responses on general mail.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#1a9b8f]" />
                  <span>
                    Prefer email? Use the form—your address is only used to reply to you, as described in our privacy policy.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#1a9b8f]" />
                  <span>We are a distributed newsroom; include your time zone when scheduling matters.</span>
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[#1a9b8f]/40 bg-[#f6f8f7] p-5">
              <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-[#0c6b62]" />
              <p className="text-sm leading-relaxed text-slate-600">
                For urgent legal or security issues, mark the subject line <strong className="text-slate-900">URGENT</strong> and include
                affected URLs or account email so we can escalate quickly.
              </p>
            </div>
          </div>

          <MagazineContactForm />
        </div>
      </MagazineContentSection>
    </MagazineShell>
  )
}
