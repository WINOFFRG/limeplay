import type { Organization, Person, WebSite, WithContext } from "schema-dts"

import Script from "next/script"

import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/constants"

export function JsonLd() {
  const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: PRODUCT_DESCRIPTION,
    name: PRODUCT_NAME,
  }

  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    description: "Open source video player components library",
    founder: {
      "@type": "Person",
      name: "winoffrg",
      url: "https://github.com/winoffrg",
    } as Person,
    logo: `/product-icon.svg`,
    name: PRODUCT_NAME,
    sameAs: ["https://github.com/winoffrg/limeplay"],
  }

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
        id="website-schema"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
        id="organization-schema"
        type="application/ld+json"
      />
    </>
  )
}
