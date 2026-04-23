import Link from 'next/link'
import { MagazineShell, MagazineContentSection, MagazinePageHeader } from '@/components/magazine/magazine-shell'
import { SITE_CONFIG } from '@/lib/site-config'

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'collect', label: 'What we collect' },
  { id: 'use', label: 'How we use data' },
  { id: 'sharing', label: 'Sharing & processors' },
  { id: 'retention', label: 'Retention' },
  { id: 'rights', label: 'Your rights' },
  { id: 'children', label: 'Children' },
  { id: 'changes', label: 'Changes' },
]

export default function PrivacyPage() {
  return (
    <MagazineShell
      hero={
        <MagazinePageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          description={`This policy describes how ${SITE_CONFIG.name} collects, uses, and safeguards personal information when you browse, subscribe, or sign in.`}
        />
      }
    >
      <MagazineContentSection>
        <div className="lg:grid lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-14">
          <nav className="mb-10 lg:mb-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0c6b62]">On this page</p>
            <ul className="mt-4 space-y-2 text-sm lg:sticky lg:top-28">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-slate-600 hover:text-[#0c6b62]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-slate-500">Last updated: April 22, 2026</p>
          </nav>

          <article className="rounded-[1.75rem] border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
            <section id="overview" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Overview</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                We believe privacy is part of editorial trust. This Privacy Policy explains what information we collect when you use{' '}
                {SITE_CONFIG.name}, why we collect it, and the choices available to you.
              </p>
            </section>

            <section id="collect" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">What we collect</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                <li>
                  <strong className="text-slate-900">Account details:</strong> such as name, email address, and profile preferences when
                  you register or update your profile.
                </li>
                <li>
                  <strong className="text-slate-900">Reading activity:</strong> basic analytics like pages viewed, approximate region
                  (derived from IP at a coarse level), and device type—used to understand what resonates with readers.
                </li>
                <li>
                  <strong className="text-slate-900">Support messages:</strong> information you send when you contact us, including your
                  email content and attachments you choose to provide.
                </li>
              </ul>
            </section>

            <section id="use" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">How we use data</h2>
              <p className="text-sm leading-relaxed text-slate-600">We use personal information to:</p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                <li>Authenticate sessions, protect accounts, and prevent abuse.</li>
                <li>Deliver newsletters or product updates when you opt in.</li>
                <li>Measure readership trends and improve layout, performance, and accessibility.</li>
                <li>Comply with legal obligations and respond to lawful requests.</li>
              </ul>
            </section>

            <section id="sharing" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Sharing &amp; processors</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                We use trusted infrastructure providers (for example, hosting, analytics, and email delivery) who process data on our
                instructions. We do not sell your personal information. We may disclose information if required by law or to protect the
                rights, safety, and integrity of our readers and staff.
              </p>
            </section>

            <section id="retention" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Retention</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                We keep account information while your account remains active and for a reasonable period afterward for backups, fraud
                prevention, and legal compliance. Analytics logs are retained in aggregated or pseudonymous form according to vendor
                settings and our internal schedules.
              </p>
            </section>

            <section id="rights" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Your rights</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Depending on where you live, you may have rights to access, correct, delete, or export your personal data, and to object
                to certain processing. To exercise these rights, contact us via the{' '}
                <Link href="/contact" className="font-semibold text-[#0c6b62] hover:underline">
                  contact page
                </Link>
                . We will verify your request and respond within the timeframe required by applicable law.
              </p>
            </section>

            <section id="children" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Children</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {SITE_CONFIG.name} is not directed to children under 13 (or the digital consent age in your region). We do not knowingly
                collect personal information from children. If you believe we have collected such data, please contact us so we can delete
                it promptly.
              </p>
            </section>

            <section id="changes" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Changes</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                When we materially update this Privacy Policy, we will revise the &quot;Last updated&quot; date and, where appropriate,
                provide a short notice on the site or by email. Please review this page periodically.
              </p>
            </section>
          </article>
        </div>
      </MagazineContentSection>
    </MagazineShell>
  )
}
