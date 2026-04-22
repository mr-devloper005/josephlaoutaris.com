import Link from 'next/link'
import { FileText, Plus, Sparkles, UserRound } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'

const articleHeroImage =
  'https://images.unsplash.com/photo-1457369804613-52c61a468e93?auto=format&fit=crop&w=1800&q=80'
const profileHeroImage =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80'

export async function MagazineTaskListPage({ task, category }: { task: 'article' | 'profile'; category?: string }) {
  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))

  const isArticle = task === 'article'
  const heroImage = isArticle ? articleHeroImage : profileHeroImage
  const Icon = isArticle ? FileText : UserRound

  const title = isArticle ? 'Articles & long reads' : 'Writer & creator profiles'
  const description = isArticle
    ? 'Essays, reporting, and commentary—organized so you can browse by topic or dive straight into the latest work.'
    : 'Meet the people behind the bylines: bios, focus areas, and links into their published stories.'

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <NavbarShell />

      <section className="relative min-h-[300px] overflow-hidden border-b border-slate-200/80 sm:min-h-[320px]">
        <div className="absolute inset-0">
          <ContentImage src={heroImage} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062c2a]/95 via-[#0c3d3a]/88 to-[#0f524c]/75" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <div className="flex max-w-3xl flex-col gap-6 lg:max-w-none lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c9f5ef]">
                <Icon className="h-3.5 w-3.5" />
                {taskConfig?.label || task}
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/88">{description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/create/${task}`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0c3d3a] shadow-md transition-colors hover:bg-[#e8faf8]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isArticle ? 'New article' : 'New profile'}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#1a9b8f] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#158a7f]"
                >
                  Pitch a story
                </Link>
                <Link
                  href={isArticle ? '/profile' : '/articles'}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
                >
                  {isArticle ? 'Browse profiles' : 'Read articles'}
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-black/25 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a8ebe3]">Filter</p>
              <p className="mt-2 text-sm text-white/80">Narrow the grid by category. Results update on the same page.</p>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" action={taskConfig?.route || '#'}>
                <label className="block flex-1 text-sm font-medium text-white/90">
                  <span className="mb-1.5 block text-xs uppercase tracking-wide text-white/60">Category</span>
                  <select
                    name="category"
                    defaultValue={normalizedCategory}
                    className="h-11 w-full rounded-xl border border-white/20 bg-white/95 px-3 text-sm text-slate-900 shadow-sm"
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-xl bg-white px-5 text-sm font-semibold text-[#0c3d3a] shadow hover:bg-[#e8faf8]"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#7ee0d3]" />
              Updated regularly from the editorial desk
            </span>
          </div>
        </div>
      </section>

      <SchemaJsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
          url: `${baseUrl}${taskConfig?.route || ''}`,
          hasPart: schemaItems,
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">Library</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">All entries</h2>
            <p className="mt-1 text-sm text-slate-600">Cards open the full {isArticle ? 'article' : 'profile'} view.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/create/${task}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a9b8f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#158a7f]"
            >
              <Plus className="h-4 w-4" />
              Create {isArticle ? 'article' : 'profile'}
            </Link>
            <Link href="/search" className="text-sm font-semibold text-[#0c6b62] hover:underline">
              Search the site →
            </Link>
          </div>
        </div>
        <TaskListClient task={task as TaskKey} initialPosts={posts} category={normalizedCategory} />
      </main>
      <Footer />
    </div>
  )
}
