import { ContentImage } from "@/components/shared/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Globe, Phone, Tag, Mail } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TaskImageCarousel } from "@/components/tasks/task-image-carousel";
import { cn } from "@/lib/utils";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { getFactoryState } from "@/design/factory/get-factory-state";
import { getProductKind } from "@/design/factory/get-product-kind";
import { DirectoryTaskDetailPage } from "@/design/products/directory/task-detail-page";
import { TASK_DETAIL_PAGE_OVERRIDE_ENABLED, TaskDetailPageOverride } from "@/overrides/task-detail-page";
import { ArticleDetailActions } from "@/components/tasks/article-detail-actions";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const absoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${value}`;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const merged = [...mediaImages, ...contentImages];
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

const toNumber = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildMapEmbedUrl = (
  latitude?: number | string,
  longitude?: number | string,
  address?: string
) => {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);
  const normalizedAddress = typeof address === "string" ? address.trim() : "";
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress;
    if (!query) return null;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      googleMapsEmbedApiKey
    )}&q=${encodeURIComponent(query)}`;
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left},${bottom},${right},${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`;
  }

  return null;
};

export async function TaskDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  if (TASK_DETAIL_PAGE_OVERRIDE_ENABLED) {
    return await TaskDetailPageOverride({ task, slug });
  }

  const taskConfig = getTaskConfig(task);
  let post: SitePost | null = null;
  try {
    post = await fetchTaskPostBySlug(task, slug);
  } catch (error) {
    console.warn("Failed to load post detail", error);
  }

  if (!post) {
    notFound();
  }

  const content = getContent(post);
  const isClassified = task === "classified";
  const isArticle = task === "article";
  const category = content.category || post.tags?.[0] || taskConfig?.label || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary =
    post.summary ||
    (typeof content.excerpt === "string" ? content.excerpt : "") ||
    "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) ||
    post.authorName ||
    "Editorial Team";
  const articleDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const mapEmbedUrl = buildMapEmbedUrl(content.latitude, content.longitude, location);
  const isBookmark = task === "sbm" || task === "social";
  const hideSidebar = isClassified || task === "image" || isBookmark;
  const related = (await fetchTaskPosts(task, 6))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      if (!content.category) return true;
      const itemContent = getContent(item);
      return itemContent.category === content.category;
    })
    .slice(0, 3);
  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/articles"}/${post.slug}`;
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage);
  const articleSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      }
    : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: taskConfig?.label || "Posts",
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/posts"}/${post.slug}`,
      },
    ],
  };
  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema;
  const { recipe } = getFactoryState();
  const productKind = getProductKind(recipe);

  const articleViews = typeof (post as any)?.views === "number" ? (post as any).views : null;
  const articleInitials = articleAuthor
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (productKind === "directory" && (task === "listing" || task === "classified" || task === "profile")) {
    return (
      <div className="min-h-screen bg-[#f8fbff]">
        <NavbarShell />
        <DirectoryTaskDetailPage
          task={task}
          taskLabel={taskConfig?.label || task}
          taskRoute={taskConfig?.route || "/"}
          post={post}
          description={description}
          category={category}
          images={images}
          mapEmbedUrl={mapEmbedUrl}
          related={related}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link
          href={taskConfig?.route || "/"}
          className="mb-6 inline-flex items-center text-sm text-slate-600 hover:text-[#0c6b62]"
        >
          ← Back to {taskConfig?.label || "posts"}
        </Link>

        <div
          className={cn(
            "grid gap-10",
            hideSidebar ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_22rem] xl:lg:grid-cols-[minmax(0,1fr)_24rem]"
          )}
        >
          <div className={cn(isClassified ? "space-y-8" : "")}>
            {isArticle ? (
              <article className="w-full space-y-6">
                <header className="space-y-5">
                  <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                    {post.title}
                  </h1>

                  <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f5f2] text-sm font-semibold text-[#0c3d3a]">
                          {articleInitials || "JT"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">By {articleAuthor}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                            {articleViews !== null ? <span>{articleViews.toLocaleString()} views</span> : null}
                            <Badge variant="secondary" className="inline-flex items-center gap-1 bg-[#e0f5f2] text-[#0c6b62] hover:bg-[#d0ebe5]">
                              <Tag className="h-3.5 w-3.5" />
                              {category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <ArticleDetailActions url={articleUrl} title={post.title} />
                    </div>
                  </div>

                  {postTags.length ? (
                    <div className="flex flex-wrap gap-2">
                      {postTags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </header>

                {images[0] ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted">
                    <ContentImage
                      src={images[0]}
                      alt={`${post.title} featured image`}
                      fill
                      className="object-cover"
                      intrinsicWidth={1600}
                      intrinsicHeight={900}
                    />
                  </div>
                ) : null}

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
                  <RichContent
                    html={articleHtml}
                    className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
                  <ArticleComments slug={post.slug} />
                </div>
              </article>
            ) : null}

            {!isArticle ? (
              <>
                {!isBookmark ? (
                  <div className={cn(isClassified ? "w-full" : "")}>
                    <TaskImageCarousel images={images} />
                  </div>
                ) : null}

                <div className={cn(isClassified ? "mx-auto w-full max-w-4xl" : "mt-6")}>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <Badge variant="secondary" className="inline-flex items-center gap-1 bg-[#e0f5f2] text-[#0c6b62] hover:bg-[#d0ebe5]">
                      <Tag className="h-3.5 w-3.5" />
                      {category}
                    </Badge>
                    {location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold text-slate-900">{post.title}</h1>
                  <RichContent html={descriptionHtml} className="mt-3 max-w-3xl" />
                </div>
              </>
            ) : null}

            {isClassified ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200/80 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">Business details</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className="break-all text-slate-900 hover:text-[#0c6b62] hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className="break-all text-slate-900 hover:text-[#0c6b62] hover:underline"
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {content.highlights?.length && !isArticle ? (
              <div className={cn("mt-8 rounded-2xl border border-slate-200/80 bg-white p-6", isClassified ? "mx-auto w-full max-w-4xl" : "")}>
                <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {content.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isClassified && mapEmbedUrl ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200/80 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Location map</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </div>

          {!hideSidebar ? (
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {isArticle ? (
                <>
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">
                      Stay in the loop
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">
                      Get new essays in your inbox.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      One email when a new long-read drops. No spam.
                    </p>
                    <Button className="mt-5 w-full bg-[#1a9b8f] text-white hover:bg-[#158a7f]" asChild>
                      <Link href="/contact">Subscribe / Contact</Link>
                    </Button>
                  </div>

                  {related.length ? (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                      <h3 className="text-sm font-semibold text-slate-900">Recommended reading</h3>
                      <ul className="mt-4 space-y-3 text-sm">
                        {related.slice(0, 3).map((item) => (
                          <li key={`aside-${item.id}`}>
                            <Link
                              href={buildPostUrl(task, item.slug)}
                              className="line-clamp-2 text-slate-600 hover:text-[#0c6b62]"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {images[0] ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                      <div className="relative aspect-[4/3] w-full bg-slate-100">
                        <ContentImage
                          src={images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          intrinsicWidth={1200}
                          intrinsicHeight={900}
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0c6b62]">
                          Featured
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-900">
                          Keep exploring more stories like this.
                        </p>
                        {taskConfig?.route ? (
                          <Button variant="outline" className="mt-4 w-full border-[#0c6b62] text-[#0c6b62] hover:bg-[#0c6b62] hover:text-white" asChild>
                            <Link href={taskConfig.route}>Browse all</Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Listing details</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {content.website && (
                        <div className="flex items-start gap-2">
                          <Globe className="mt-0.5 h-4 w-4" />
                          <a
                            href={content.website}
                            className="break-all text-slate-900 hover:text-[#0c6b62] hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {content.website}
                          </a>
                        </div>
                      )}
                      {content.phone && (
                        <div className="flex items-start gap-2">
                          <Phone className="mt-0.5 h-4 w-4" />
                          <span>{content.phone}</span>
                        </div>
                      )}
                      {content.email && (
                        <div className="flex items-start gap-2">
                          <Mail className="mt-0.5 h-4 w-4" />
                          <a
                            href={`mailto:${content.email}`}
                            className="break-all text-slate-900 hover:text-[#0c6b62] hover:underline"
                          >
                            {content.email}
                          </a>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4" />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>
                    {content.website ? (
                      <Button className="mt-5 w-full bg-[#1a9b8f] text-white hover:bg-[#158a7f]" asChild>
                        <a href={content.website} target="_blank" rel="noreferrer">
                          Visit Website
                        </a>
                      </Button>
                    ) : null}
                  </div>

                  {mapEmbedUrl ? (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">Location map</p>
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                        <iframe
                          title="Business location map"
                          src={mapEmbedUrl}
                          className="h-56 w-full"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </aside>
          ) : null}
        </div>

        <section className="mt-12">
          {related.length ? (
            <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                More in {category}
              </h2>
              {taskConfig?.route && (
                <Link
                  href={taskConfig.route}
                  className="text-sm text-slate-600 hover:text-[#0c6b62]"
                >
                  View all
                </Link>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TaskPostCard
                  key={item.id}
                  post={item}
                  href={buildPostUrl(task, item.slug)}
                />
              ))}
            </div>
            </>
          ) : null}
          <nav className="mt-6 rounded-2xl border border-slate-200/80 bg-white/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Related links</p>
            <ul className="mt-2 space-y-2 text-sm">
              {related.map((item) => (
                <li key={`link-${item.id}`}>
                  <Link
                    href={buildPostUrl(task, item.slug)}
                    className="text-[#0c6b62] underline-offset-4 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {taskConfig?.route ? (
                <li>
                  <Link
                    href={taskConfig.route}
                    className="text-[#0c6b62] underline-offset-4 hover:underline"
                  >
                    Browse all {taskConfig.label}
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href={`/search?q=${encodeURIComponent(category)}`}
                  className="text-[#0c6b62] underline-offset-4 hover:underline"
                >
                  Search more in {category}
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}
