import Link from 'next/link'
import { MagazineShell, MagazineContentSection, MagazinePageHeader } from '@/components/magazine/magazine-shell'
import { SITE_CONFIG } from '@/lib/site-config'

const toc = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'eligibility', label: 'Eligibility & accounts' },
  { id: 'content', label: 'Content & licensing' },
  { id: 'conduct', label: 'Acceptable use' },
  { id: 'disclaimers', label: 'Disclaimers' },
  { id: 'termination', label: 'Suspension & termination' },
  { id: 'law', label: 'Governing law' },
  { id: 'contact', label: 'Contact' },
]

export default function TermsPage() {
  return (
    <MagazineShell
      hero={
        <MagazinePageHeader
          eyebrow="Legal"
          title="Terms of Use"
          description={`These terms explain how you may use ${SITE_CONFIG.name}, including reading, commenting where available, and creating an account. By using the site, you agree to this agreement.`}
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
            <section id="introduction" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Introduction</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Welcome to {SITE_CONFIG.name}. We provide a digital publication focused on articles and contributor profiles. These Terms
                of Use (&quot;Terms&quot;) form a binding agreement between you and the operator of this website. If you do not agree, please
                discontinue use of the services.
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                We may update these Terms as the product evolves. Material changes will be reflected with a new &quot;Last updated&quot; date
                at the top of this page. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section id="eligibility" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Eligibility &amp; accounts</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                You must be able to form a legally binding contract in your jurisdiction to register an account. You agree to provide
                accurate information and to keep login credentials confidential. You are responsible for activity that occurs under your
                account unless you notify us promptly of unauthorized access.
              </p>
            </section>

            <section id="content" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Content &amp; licensing</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Unless otherwise noted, editorial content and branding on {SITE_CONFIG.name} are owned by the site operator or its
                licensors and are protected by copyright and other intellectual property laws. You may read, share links, and quote
                reasonable excerpts for commentary or news reporting in line with fair use (or similar doctrines in your country).
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                If you publish user-generated material (for example, comments or submitted bios), you grant us a non-exclusive license to
                host, display, distribute, and adapt that material as needed to operate the service—without waiving your ownership of your
                underlying work.
              </p>
            </section>

            <section id="conduct" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Acceptable use</h2>
              <p className="text-sm leading-relaxed text-slate-600">You agree not to:</p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                <li>Harass, threaten, or impersonate others.</li>
                <li>Upload malware, attempt unauthorized access, or disrupt the infrastructure.</li>
                <li>Scrape or bulk-download the site in a way that degrades performance or bypasses technical limits.</li>
                <li>Use the service for unlawful purposes or to distribute illegal content.</li>
              </ul>
            </section>

            <section id="disclaimers" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Disclaimers</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                The site and all content are provided &quot;as is&quot; without warranties of any kind, whether express or implied. We do not
                warrant uninterrupted or error-free operation. Editorial content reflects author viewpoints and should not be read as
                professional advice (legal, medical, financial, or otherwise) unless explicitly stated.
              </p>
            </section>

            <section id="termination" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Suspension &amp; termination</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                We may suspend or terminate access if we reasonably believe you have violated these Terms or if required by law. You may
                stop using the site at any time. Provisions that by their nature should survive (including ownership, disclaimers, and
                liability limits where permitted) will remain in effect.
              </p>
            </section>

            <section id="law" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Governing law</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                These Terms are governed by the laws applicable to the site operator&apos;s principal place of business, without regard to
                conflict-of-law rules. Courts in that jurisdiction will have exclusive venue, subject to mandatory consumer protections in
                your locale where they cannot be waived.
              </p>
            </section>

            <section id="contact" className="scroll-mt-28 space-y-4 border-t border-slate-100 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Contact</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Questions about these Terms? Reach the team through the{' '}
                <Link href="/contact" className="font-semibold text-[#0c6b62] hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>
          </article>
        </div>
      </MagazineContentSection>
    </MagazineShell>
  )
}
