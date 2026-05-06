import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";

export const revalidate = 3;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (raw?: string | null, fallback = "Profile details will appear here once available.") => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeRichHtml(source);
  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }
  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const media = Array.isArray((post as any).media) ? ((post as any).media as any[]) : [];
  const mediaUrl = media.find((item) => typeof item?.url === "string" && item.url)?.url as string | undefined;
  const heroUrl =
    (typeof content.heroImage === "string" && content.heroImage) ||
    (typeof content.coverImage === "string" && content.coverImage) ||
    mediaUrl ||
    logoUrl;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const email = content.email as string | undefined;
  const phone = content.phone as string | undefined;
  const location = (content.address as string | undefined) || (content.location as string | undefined);
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />

        <section className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
          <div className="relative h-[22rem] sm:h-[26rem]">
            {heroUrl ? (
              <ContentImage
                src={heroUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 896px, 100vw"
                intrinsicWidth={1600}
                intrinsicHeight={900}
                priority
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(90deg,#bff3d2_0%,#88e0b6_40%,#5fd0b3_100%)]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.0)_0%,rgba(2,6,23,0.65)_55%,rgba(2,6,23,0.92)_100%)]" />

            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
              Active now
            </div>

            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-8 sm:pb-8">
              <div className="grid gap-6 lg:grid-cols-[9rem_minmax(0,1fr)_12rem] lg:items-end">
                <div className="flex items-end justify-start">
                  <div className="relative h-28 w-28 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-[0_20px_50px_rgba(2,6,23,0.45)] sm:h-32 sm:w-32">
                    {logoUrl ? (
                      <ContentImage
                        src={logoUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                        intrinsicWidth={256}
                        intrinsicHeight={256}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white/80">
                        {post.title.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 ring-1 ring-white/10" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
                      Creator profile
                    </span>
                    {domain ? (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85 backdrop-blur">
                        {domain}
                      </span>
                    ) : null}
                  </div>
                  <h1 className="mt-3 truncate text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {brandName}
                  </h1>
                </div>

                {website ? (
                  <div className="lg:flex lg:justify-end">
                    <Button asChild className="w-full rounded-full bg-white/10 text-white hover:bg-white/15 lg:w-auto">
                      <Link href={website} target="_blank" rel="noopener noreferrer">
                        Visit website â†’
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-5 text-white/85 backdrop-blur-md sm:p-6">
                <div
                  className="prose prose-invert max-w-none text-sm leading-7 prose-p:my-0 prose-a:text-white prose-a:underline prose-strong:text-white sm:text-base"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">About</h2>
              <article
                className="article-content prose prose-slate mt-4 max-w-none text-base leading-relaxed prose-p:my-4 prose-a:text-primary prose-a:underline prose-strong:font-semibold"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>

            {suggestedArticles.length ? (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-foreground">Suggested articles</h2>
                  <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {suggestedArticles.slice(0, 4).map((article) => (
                    <TaskPostCard
                      key={article.id}
                      post={article}
                      href={buildPostUrl("article", article.slug)}
                      compact
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">Quick info</h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {domain ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Website</p>
                    <p className="mt-1 text-foreground">{domain}</p>
                  </div>
                ) : null}
                {email ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                    <Link href={`mailto:${email}`} className="mt-1 block break-all text-foreground hover:underline">
                      {email}
                    </Link>
                  </div>
                ) : null}
                {phone ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
                    <p className="mt-1 text-foreground">{phone}</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-2">
                {website ? (
                  <Button asChild className="w-full rounded-full">
                    <Link href={website} target="_blank" rel="noopener noreferrer">
                      Visit website
                    </Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/profile">Browse profiles</Link>
                </Button>
              </div>
            </div>

            {suggestedArticles.length ? (
              <nav className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Related links</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {suggestedArticles.slice(0, 5).map((article) => (
                    <li key={`related-${article.id}`}>
                      <Link
                        href={buildPostUrl("article", article.slug)}
                        className="line-clamp-2 text-muted-foreground hover:text-foreground"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
