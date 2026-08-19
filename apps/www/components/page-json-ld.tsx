import type {
  BreadcrumbList,
  ListItem,
  TechArticle,
  WithContext,
} from "schema-dts"

import { PRODUCT_NAME, SITE_URL } from "@/lib/constants"

type PageJsonLdProps = {
  breadcrumbs: Array<{
    name: string
    path: string
  }>
  description: string
  path: string
  title: string
}

export function PageJsonLd({
  breadcrumbs,
  description,
  path,
  title,
}: PageJsonLdProps) {
  const url = new URL(path, SITE_URL).toString()
  const articleSchema: WithContext<TechArticle> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    about: PRODUCT_NAME,
    description,
    headline: title,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    mainEntityOfPage: url,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    url,
  }
  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map(
      (breadcrumb, breadcrumbIndex): ListItem => ({
        "@type": "ListItem",
        item: new URL(breadcrumb.path, SITE_URL).toString(),
        name: breadcrumb.name,
        position: breadcrumbIndex + 1,
      })
    ),
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
        id={`article-schema-${path.replaceAll("/", "-")}`}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
        id={`breadcrumb-schema-${path.replaceAll("/", "-")}`}
        type="application/ld+json"
      />
    </>
  )
}
