import Script from "next/script"
import type { Organization, Person, WebSite, WithContext } from "schema-dts"

import {
  PROD_BASE_HOST,
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
} from "@/lib/constants"

export function JsonLd() {
  const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: PRODUCT_NAME,
    description: PRODUCT_DESCRIPTION,
    url: PROD_BASE_HOST,
  }

  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: PRODUCT_NAME,
    description: "Open source video player components library",
    url: PROD_BASE_HOST,
    logo: `${PROD_BASE_HOST}/product-icon.svg`,
    sameAs: ["https://github.com/winoffrg/limeplay"],
    founder: {
      "@type": "Person",
      name: "winoffrg",
      url: "https://github.com/winoffrg",
    } as Person,
  }

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}
