import Link from 'next/link'
import { Search, Sparkles } from 'lucide-react'
import { MagazineShell, MagazineContentSection, MagazinePageHeader } from '@/components/magazine/magazine-shell'
import { Button } from '@/components/ui/button'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG } from '@/lib/site-config'
import { TaskPostCard } from '@/components/shared/task-post-card'
export const revalidate = 3

const matchText = (value: string, query: string) => value.toLowerCase().includes(query)

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')

const compactText = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase()
}

function searchHref(opts: { q?: string; category?: string; task?: string | null }) {
  const params = new URLSearchParams()
  params.set('master', '1')
  if (opts.q?.trim()) params.set('q', opts.q.trim())
  if (opts.category?.trim()) params.set('category', opts.category.trim())
  if (opts.task?.trim()) params.set('task', opts.task.trim())
  return `/search?${params.toString()}`
}

function chipClass(active: boolean) {
  return active
    ? 'border-[#1a9b8f] bg-[#1a9b8f] text-white shadow-sm'
    : 'border-slate-200 bg-white text-slate-700 hover:border-[#1a9b8f]/50 hover:text-[#0c6b62]'
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const taskFilter = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: taskFilter || undefined } : undefined,
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.flatMap((t) => getMockPostsForTask(t.key))

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === 'object' ? post.content : {}
    const typeText = compactText((content as { type?: string }).type)
    if (typeText === 'comment') return false
    const description = compactText((content as { description?: string }).description)
    const body = compactText((content as { body?: string }).body)
    const excerpt = compactText((content as { excerpt?: string }).excerpt)
    const categoryText = compactText((content as { category?: string }).category)
    const tags = Array.isArray(post.tags) ? post.tags.join(' ') : ''
    const tagsText = compactText(tags)
    const derivedCategory = categoryText || tagsText
    if (category && !derivedCategory.includes(category)) return false
    if (taskFilter && typeText && typeText !== taskFilter) return false
    if (!normalized.length) return true
    return (
      matchText(compactText(post.title || ''), normalized) ||
      matchText(compactText(post.summary || ''), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    )
  })

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24)

  const title = query ? `Results for “${query}”` : 'Search the library'
  const description = query
    ? 'Matches across titles, summaries, tags, and body text. Use filters to focus on articles or profiles.'
    : 'Browse what is on file right now, or enter a keyword to narrow the list. Everything stays in the same calm reading layout as the rest of the site.'

  const searchForm = (
    <form action="/search" className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch">
      <input type="hidden" name="master" value="1" />
      {category ? <input type="hidden" name="category" value={category} /> : null}
      {taskFilter ? <input type="hidden" name="task" value={taskFilter} /> : null}
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0c6b62]" />
        <input
          name="q"
          defaultValue={query}
          placeholder="Articles, profiles, tags…"
          className="h-12 w-full rounded-full border border-white/30 bg-white/95 pl-11 pr-4 text-sm text-slate-900 shadow-inner outline-none ring-2 ring-transparent placeholder:text-slate-400 focus:border-[#1a9b8f] focus:ring-[#1a9b8f]/30"
        />
      </div>
      <Button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-white px-8 text-sm font-semibold text-[#0c3d3a] shadow-md hover:bg-[#e8faf8]"
      >
        Search
      </Button>
    </form>
  )

  const enabledKeys = SITE_CONFIG.tasks.filter((t) => t.enabled).map((t) => t.key)

  return (
    <MagazineShell
      hero={
        <MagazinePageHeader eyebrow="Discover" title={title} description={description} actions={searchForm} />
      }
    >
      <MagazineContentSection className="!pt-8">
        <div className="flex flex-col gap-6 border-b border-slate-200/90 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Sparkles className="h-4 w-4 text-[#1a9b8f]" />
            <span>
              <strong className="font-semibold text-slate-900">{results.length}</strong> {results.length === 1 ? 'match' : 'matches'}
              {query ? ` for your search` : ' in this view'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={searchHref({ q: query, category: category || undefined, task: null })}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${chipClass(!taskFilter)}`}
            >
              All types
            </Link>
            {enabledKeys.includes('article') ? (
              <Link
                href={searchHref({ q: query, category: category || undefined, task: 'article' })}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${chipClass(taskFilter === 'article')}`}
              >
                Articles
              </Link>
            ) : null}
            {enabledKeys.includes('profile') ? (
              <Link
                href={searchHref({ q: query, category: category || undefined, task: 'profile' })}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${chipClass(taskFilter === 'profile')}`}
              >
                Profiles
              </Link>
            ) : null}
          </div>
        </div>

        {!query ? (
          <p className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm">
            Showing a recent slice of the feed. Add a keyword above to search titles, summaries, and tags—or jump to{' '}
            <Link href="/articles" className="font-semibold text-[#0c6b62] hover:underline">
              Articles
            </Link>{' '}
            or{' '}
            <Link href="/profile" className="font-semibold text-[#0c6b62] hover:underline">
              Profiles
            </Link>{' '}
            to browse in context.
          </p>
        ) : null}

        <div className="mt-10">
          {results.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post) => {
                const task = getPostTaskKey(post)
                const href = task ? buildPostUrl(task, post.slug) : `/posts/${post.slug}`
                return <TaskPostCard key={post.id} post={post} href={href} taskKey={task ?? undefined} />
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#1a9b8f]/35 bg-gradient-to-br from-[#e8faf8] to-white px-8 py-16 text-center shadow-sm">
              <Search className="mx-auto h-10 w-10 text-[#1a9b8f]" />
              <h2 className="mt-4 text-xl font-bold text-slate-900">No matches yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                Try a shorter keyword, clear the type filter, or browse the latest posts from the home page and section hubs.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full bg-[#1a9b8f] px-6 text-white hover:bg-[#158a7f]">
                  <Link href="/search">View recent posts</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white">
                  <Link href="/articles">Go to articles</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </MagazineContentSection>
    </MagazineShell>
  )
}
