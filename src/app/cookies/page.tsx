import Link from 'next/link'
import { MagazineShell, MagazineContentSection, MagazinePageHeader } from '@/components/magazine/magazine-shell'
import { SITE_CONFIG } from '@/lib/site-config'

const toc = [
  { id: 'summary', label: 'Summary' },
  { id: 'what', label: 'What cookies are' },
  { id: 'types', label: 'Cookies we use' },
  { id: 'manage', label: 'Managing preferences' },
  { id: 'third', label: 'Third parties' },
  { id: 'updates', label: 'Updates' },
]

export default function CookiesPage() {
  return (
    <MagazineShell
      hero={
        <MagazinePageHeader
          eyebrow="Legal"
          title="Cookie Policy"
          description={`How ${SITE_CONFIG.name} uses cookies and similar technologies to keep sessions secure, remember preferences, and understand readership in aggregate.`}
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
            <section id="summary" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Summary</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Cookies are small text files stored on your device. We use them sparingly: to keep you signed in, to remember lightweight UI
                preferences, and—where enabled—to measure traffic so we can improve performance and story placement.
              </p>
            </section>

            <section id="what" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">What cookies are</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                When you load {SITE_CONFIG.name}, your browser may store cookies set by us (first-party) or by services we rely on
                (third-party). Similar technologies include local storage, session storage, and pixels; this policy covers them when they
                perform the same functions as cookies.
              </p>
            </section>

            <section id="types" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Cookies we use</h2>
              <div className="space-y-6 text-sm leading-relaxed text-slate-600">
                <div className="rounded-xl border border-slate-100 bg-[#f6f8f7] p-5">
                  <h3 className="font-bold text-slate-900">Essential</h3>
                  <p className="mt-2">
                    Required for security, load balancing, and authentication. These cannot be switched off if you want the site to
                    function normally (for example, staying logged in after you sign in).
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#f6f8f7] p-5">
                  <h3 className="font-bold text-slate-900">Preferences</h3>
                  <p className="mt-2">
                    Remember choices such as language or reading settings. They make repeat visits smoother without rebuilding the UI from
                    scratch each time.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#f6f8f7] p-5">
                  <h3 className="font-bold text-slate-900">Analytics</h3>
                  <p className="mt-2">
                    Help us understand which sections are read, how far readers scroll, and whether new layouts help or hurt clarity. Where
                    possible we configure analytics to use aggregated or pseudonymous data.
                  </p>
                </div>
              </div>
            </section>

            <section id="manage" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Managing preferences</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                You can control cookies through your browser settings: block third-party cookies, clear stored data on exit, or delete
                existing cookies for this domain. Note that disabling essential cookies may sign you out or break certain features.
              </p>
            </section>

            <section id="third" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Third parties</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Some cookies are set by analytics or infrastructure partners. Their use is governed by their own policies in addition to
                ours. We choose vendors with strong security practices and data processing agreements where required.
              </p>
            </section>

            <section id="updates" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Updates</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                When we change our cookie practices, we update this page and the &quot;Last updated&quot; date. For questions, visit our{' '}
                <Link href="/contact" className="font-semibold text-[#0c6b62] hover:underline">
                  contact page
                </Link>{' '}
                or review the <Link href="/privacy" className="font-semibold text-[#0c6b62] hover:underline">Privacy Policy</Link>.
              </p>
            </section>
          </article>
        </div>
      </MagazineContentSection>
    </MagazineShell>
  )
}
