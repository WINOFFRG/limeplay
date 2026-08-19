import type {
  Organization,
  Person,
  SoftwareSourceCode,
  WebSite,
  WithContext,
} from "schema-dts"

import { PRODUCT_DESCRIPTION, PRODUCT_NAME, SITE_URL } from "@/lib/constants"

const organizationId = `${SITE_URL}/#organization`
const websiteId = `${SITE_URL}/#website`

export function JsonLd() {
  const websiteSchema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@id": websiteId,
    "@type": "WebSite",
    description: PRODUCT_DESCRIPTION,
    inLanguage: "en-US",
    name: PRODUCT_NAME,
    publisher: {
      "@id": organizationId,
    },
    url: SITE_URL,
  }

  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@id": organizationId,
    "@type": "Organization",
    description: "Open source video player components library",
    founder: {
      "@type": "Person",
      name: "winoffrg",
      url: "https://github.com/winoffrg",
    } as Person,
    logo: `${SITE_URL}/product-icon.svg`,
    name: PRODUCT_NAME,
    sameAs: ["https://github.com/winoffrg/limeplay"],
    url: SITE_URL,
  }

  const softwareSchema: WithContext<SoftwareSourceCode> = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    codeRepository: "https://github.com/winoffrg/limeplay",
    description: PRODUCT_DESCRIPTION,
    isAccessibleForFree: true,
    license: "https://opensource.org/license/mit",
    name: PRODUCT_NAME,
    programmingLanguage: ["TypeScript", "React"],
    runtimePlatform: "Web browser",
    url: SITE_URL,
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
        id="website-schema"
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
        id="organization-schema"
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c"),
        }}
        id="software-schema"
        type="application/ld+json"
      />
    </>
  )
}
