import Link from 'next/link'
import { BookOpen, Calendar, ChevronRight, Compass, FileText, Mail, MapPin, Play, Quote, Sparkles, TrendingUp, UserRound } from 'lucide-react'
import { format } from 'date-fns'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { ContentImage } from '@/components/shared/content-image'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchTaskPosts } from '@/lib/task-data'
import type { SitePost } from '@/lib/site-connector'

export const HOME_PAGE_OVERRIDE_ENABLED = true

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage =
    typeof post?.content === 'object' && post?.content && Array.isArray((post.content as { images?: string[] }).images)
      ? (post.content as { images?: string[] }).images?.find((url: unknown) => typeof url === 'string' && url)
      : null
  const logo =
    typeof post?.content === 'object' && post?.content && typeof (post.content as { logo?: string }).logo === 'string'
      ? (post.content as { logo?: string }).logo
      : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function getCategory(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return 'Stories'
  const content = post.content as Record<string, unknown>
  return typeof content.category === 'string' ? content.category : post.tags?.[0] || 'Stories'
}

function formatPostDate(post?: SitePost | null) {
  const raw = post?.publishedAt || post?.createdAt
  if (!raw) return format(new Date(), 'MMMM d, yyyy')
  try {
    return format(new Date(raw), 'MMMM d, yyyy')
  } catch {
    return format(new Date(), 'MMMM d, yyyy')
  }
}

const heroBackdrop =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80'

const categoryTiles = [
  { label: 'Essays', src: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Profiles', src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80' },
  { label: 'Field notes', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Culture', src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' },
]

export async function HomePageOverride() {
  const [articlePosts, profilePosts] = await Promise.all([
    fetchTaskPosts('article', 14, { allowMockFallback: true, fresh: true }),
    fetchTaskPosts('profile', 8, { allowMockFallback: true, fresh: true }),
  ])

  const lead = articlePosts[0]
  const featured = articlePosts.slice(0, 6)
  const latest = articlePosts.slice(1, 7)
  const trending = articlePosts.slice(0, 5)
  const spotlightProfiles = profilePosts.slice(0, 2)
  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  const heroTitle = lead?.title || 'Long reads, sharp profiles, and voices worth following'
  const heroDate = formatPostDate(lead)

  const highlights = [
    { title: 'Editor picks', sub: 'Fresh angles each week', icon: Sparkles },
    { title: 'Writer spotlights', sub: 'Meet the contributors', icon: UserRound },
    { title: 'Deeper context', sub: 'Beyond the headline', icon: Compass },
    { title: 'Local lens', sub: 'Places and people', icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />

      <section className="relative -mt-[4.25rem] min-h-[min(92vh,760px)] overflow-hidden pt-[4.25rem]">
        <div className="absolute inset-0">
          <ContentImage src={heroBackdrop} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-10 pt-10 sm:px-6 lg:min-h-[min(88vh,720px)] lg:px-8 lg:pb-14 lg:pt-16">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                New story
              </span>
              <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                {lead ? getCategory(lead) : 'Articles'}
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">{heroTitle}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/85">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{heroDate}</span>
              {lead ? (
                <Link href={`/articles/${lead.slug}`} className="ml-2 inline-flex items-center gap-1 font-semibold text-[#7ee0d3] hover:underline">
                  Read now
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ title, sub, icon: Icon }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-black/35 px-4 py-4 backdrop-blur-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#7ee0d3]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-xs text-white/70">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Site guide</p>
          <h2 className="mx-auto mt-2 max-w-2xl text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Explore articles, profiles, and policies
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-600">
            Same teal palette as the homepage—pick a destination and keep reading without switching visual languages.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/articles', title: 'Articles', desc: 'Long reads, reporting, and commentary.', icon: FileText },
              { href: '/profile', title: 'Profiles', desc: 'Writers, editors, and local voices.', icon: UserRound },
              { href: '/about', title: 'About', desc: 'Mission, standards, and how we work.', icon: BookOpen },
              { href: '/contact', title: 'Contact', desc: 'Tips, corrections, and partnerships.', icon: Mail },
            ].map(({ href, title, desc, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-slate-200/90 bg-[#f6f8f7] p-5 shadow-sm transition-all hover:border-[#1a9b8f]/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c3d3a] text-[#a8ebe3] transition-colors group-hover:bg-[#1a9b8f] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-[#0c6b62]">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0c6b62]">
                  Open
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-3 text-sm text-slate-600">
            <Link href="/terms" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:border-[#1a9b8f]/50 hover:text-[#0c6b62]">
              Terms of Use
            </Link>
            <Link href="/privacy" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:border-[#1a9b8f]/50 hover:text-[#0c6b62]">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:border-[#1a9b8f]/50 hover:text-[#0c6b62]">
              Cookie Policy
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Featured</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Featured stories</h2>
          </div>
          <Link href="/articles" className="hidden items-center gap-1 text-sm font-semibold text-[#0c6b62] hover:underline sm:inline-flex">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(featured.length
            ? featured
            : [1, 2, 3].map((i) => ({
                id: `placeholder-${i}`,
                title: i === 1 ? 'Publish your first feature' : i === 2 ? 'Profiles that anchor the story' : 'Weekly reading list',
                slug: '',
                summary: '',
                content: null,
                media: [],
              }))
          ).map((post) => {
            const isPlaceholder = !post.slug
            const href = isPlaceholder ? '/articles' : `/articles/${post.slug}`
            return (
              <Link
                key={post.id}
                href={href}
                className="group relative h-[340px] w-[220px] shrink-0 overflow-hidden rounded-3xl shadow-lg sm:h-[380px] sm:w-[260px]"
              >
                <ContentImage
                  src={isPlaceholder ? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80' : getPostImage(post)}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                  {isPlaceholder ? 'Articles' : getCategory(post)}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-semibold leading-snug text-white">{post.title}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">The latest</h2>
            <div className="mt-8 space-y-6">
              {latest.length ? (
                latest.map((post) => (
                  <Link key={post.id} href={`/articles/${post.slug}`} className="group flex gap-4 rounded-2xl border border-transparent p-2 transition-colors hover:border-slate-200 hover:bg-slate-50">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-32">
                      <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 py-1">
                      <h3 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-[#0c6b62]">{post.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.summary || 'A closer look at the ideas, people, and places behind the story.'}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-[#e0f5f2] px-2.5 py-0.5 font-semibold text-[#0c6b62]">{getCategory(post)}</span>
                        <span>{post.authorName || SITE_CONFIG.name}</span>
                        <span aria-hidden>·</span>
                        <span>{formatPostDate(post)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-slate-600">Articles will appear here when they are published.</p>
              )}
            </div>
            <div className="mt-10">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#0c6b62] bg-white px-8 py-3 text-sm font-semibold text-[#0c6b62] transition-colors hover:bg-[#0c6b62] hover:text-white"
              >
                Load more
              </Link>
            </div>
          </div>

          <aside className="space-y-10">
            <div className="rounded-3xl border border-slate-200 bg-[#f6f8f7] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">On trending</h3>
                <TrendingUp className="h-5 w-5 text-[#0c6b62]" />
              </div>
              <ol className="mt-5 space-y-4">
                {trending.length ? (
                  trending.map((post, i) => (
                    <li key={post.id} className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0c3d3a] text-sm font-bold text-white">{i + 1}</span>
                      <div className="min-w-0">
                        <Link href={`/articles/${post.slug}`} className="font-semibold leading-snug text-slate-900 hover:text-[#0c6b62]">
                          {post.title}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          <span className="font-medium text-[#0c6b62]">{getCategory(post)}</span> · {formatPostDate(post)}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-600">Trending picks will show once articles are published.</li>
                )}
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Spotlight profiles</h3>
                <Link href="/profile" className="text-sm font-semibold text-[#0c6b62] hover:underline">
                  See all
                </Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(spotlightProfiles.length
                  ? spotlightProfiles
                  : [{ id: 'ph', title: 'Browse profiles', slug: '', summary: 'Meet writers and contributors.', content: null, media: [] } as SitePost]
                ).map((post) => {
                  const href = post.slug ? `/profile/${post.slug}` : '/profile'
                  return (
                    <Link key={post.id} href={href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <div className="relative aspect-video bg-slate-100">
                        <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#0c3d3a] shadow">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                        </div>
                      </div>
                      <p className="p-3 text-sm font-semibold text-slate-900 group-hover:text-[#0c6b62]">{post.title}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Categories</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTiles.map((cat) => (
            <Link
              key={cat.label}
              href="/articles"
              className="group relative flex h-44 items-center justify-center overflow-hidden rounded-3xl shadow-md sm:h-52"
            >
              <ContentImage src={cat.src} alt={cat.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
              <span className="relative text-2xl font-bold text-white">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#eef1f0] py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
            <ContentImage
              src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200/80 bg-[#f9faf9] p-8 shadow-sm lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Upcoming</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Live reader salon: profiles &amp; process</h2>
            <p className="mt-4 font-mono text-3xl font-semibold tracking-widest text-[#0c3d3a]">09 : 14 : 23 : 01</p>
            <p className="mt-2 text-sm text-slate-600">Join us for a live conversation with featured contributors.</p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#1a9b8f] px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#158a7f]"
            >
              Register now
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Our testimonials</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-bold tracking-tight text-slate-900">What our readers and writers say</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {[
            {
              quote:
                'The long-form pieces feel edited with care, and the profile pages make it easy to follow voices I trust. This is my first stop for thoughtful reading.',
              name: 'Alex Rivera',
              handle: '@alexrivera',
            },
            {
              quote:
                'As a contributor, the layout puts the work first. Clean typography, strong photography, and a community that actually reads.',
              name: 'Jordan Lee',
              handle: '@jordanlee',
            },
          ].map((t) => (
            <div key={t.name} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <Quote className="h-8 w-8 text-[#1a9b8f]/50" />
              <p className="mt-4 text-lg leading-relaxed text-slate-700">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f5f2] text-sm font-bold text-[#0c3d3a]">{t.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-[#0c6b62]">{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0">
          <ContentImage
            src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/78" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Become a {SITE_CONFIG.name} writer</h2>
          <p className="mt-4 text-lg text-white/80">Share essays, interviews, and profiles. We welcome reporters, critics, and curious locals.</p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center rounded-full border-2 border-white px-10 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-slate-900"
          >
            Join now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
