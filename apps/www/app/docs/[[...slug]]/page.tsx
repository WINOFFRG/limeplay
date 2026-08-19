import type { Metadata } from "next"

import { createRelativeLink } from "fumadocs-ui/mdx"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"
import { notFound } from "next/navigation"

import { LLMCopyButton, ViewOptions } from "@/components/ai/page-actions"
import { getMDXComponents } from "@/components/mdx-components"
import { PageJsonLd } from "@/components/page-json-ld"
import { getPageImage, source } from "@/lib/source"

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const canonicalPath = getCanonicalPath(page.slugs, page.url)
  const description = getPageDescription(page.data.title, page.data.description)
  const imageUrl = getPageImage(page).url

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      description,
      images: imageUrl,
      title: page.data.title,
      type: "article",
      url: canonicalPath,
    },
    title: page.data.title,
    twitter: {
      description,
      images: imageUrl,
      title: page.data.title,
    },
  }
}

export function generateStaticParams() {
  return source.generateParams()
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDXContent = page.data.body
  const canonicalPath = getCanonicalPath(page.slugs, page.url)
  const markdownUrl = `/llms.mdx/${page.slugs.join("/")}.mdx`
  const description = getPageDescription(page.data.title, page.data.description)
  const parentBreadcrumbs = page.slugs.slice(0, -1).map((slug, slugIndex) => ({
    name: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    path: `/docs/${page.slugs.slice(0, slugIndex + 1).join("/")}`,
  }))
  const breadcrumbs = [
    { name: "Home", path: "/" },
    ...(page.url === "/docs/quick-start"
      ? []
      : [{ name: "Documentation", path: "/docs/quick-start" }]),
    ...parentBreadcrumbs,
    { name: page.data.title, path: canonicalPath },
  ]

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <PageJsonLd
        breadcrumbs={breadcrumbs}
        description={description}
        path={canonicalPath}
        title={page.data.title}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <div className="flex flex-row flex-wrap items-center gap-2 pb-6">
        <LLMCopyButton markdownUrl={markdownUrl} />
        <ViewOptions
          githubUrl={`https://github.com/winoffrg/limeplay/blob/main/apps/www/content/docs/${page.path}`}
          markdownUrl={markdownUrl}
        />
      </div>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

function getCanonicalPath(slugs: string[], pageUrl: string) {
  if (slugs[0] === "blocks") {
    return `/blocks/${slugs.slice(1).join("/")}`
  }

  return pageUrl
}

function getPageDescription(title: string, description?: string) {
  return (
    description ??
    `Learn how ${title} works in Limeplay's React media player component system.`
  )
}
