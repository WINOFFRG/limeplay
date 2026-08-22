import type { Metadata } from "next"

import Link from "next/link"

export const metadata: Metadata = {
  alternates: { canonical: "/developers" },
  description:
    "Limeplay developer resources, including OpenAPI, agent documentation, the static deployment marker, installation guidance, and source links.",
  openGraph: {
    title: "Limeplay developer resources and API",
    url: "/developers",
  },
  title: "Developer resources and API",
}

const resources = [
  {
    description: "OpenAPI 3.1 description of the public API surface.",
    href: "/openapi.json",
    title: "OpenAPI specification",
  },
  {
    description: "Compact installation and documentation map for agents.",
    href: "/llms.txt",
    title: "Agent index",
  },
  {
    description: "Expanded machine-readable Limeplay documentation.",
    href: "/llms-full.txt",
    title: "Full agent documentation",
  },
  {
    description: "Canonical public pages available to crawlers and agents.",
    href: "/sitemap.xml",
    title: "Sitemap",
  },
] as const

export default function DevelopersPage() {
  return (
    <div
      className="
        relative z-10 mx-auto w-full max-w-5xl border-x border-border px-page py-20
        md:py-28
      "
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Limeplay for developers and agents
        </p>
        <h1
          className="
            text-4xl font-semibold tracking-tight text-balance text-foreground
            md:text-5xl
          "
        >
          Limeplay developer resources and API
        </h1>
        <p className="mt-5 max-w-2xl text-base/7 text-muted-foreground">
          Find machine-readable specifications, installation guides, service
          metadata, and source links from one canonical page.
        </p>

        <section aria-labelledby="machine-readable-heading" className="mt-12">
          <h2
            className="text-xl font-semibold text-foreground"
            id="machine-readable-heading"
          >
            Machine-readable resources
          </h2>
          <div
            className="
              mt-5 grid gap-3
              sm:grid-cols-2
            "
          >
            {resources.map((resource) => (
              <a
                className="
                  rounded-xl border border-border bg-background/60 p-5 focus-ring transition-colors
                  hover:bg-background
                "
                href={resource.href}
                key={resource.href}
              >
                <h3 className="font-medium text-foreground">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm/6 text-muted-foreground">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="api-access-heading" className="mt-12">
          <h2
            className="text-xl font-semibold text-foreground"
            id="api-access-heading"
          >
            API access
          </h2>
          <p className="mt-3 text-sm/7 text-muted-foreground">
            The public API currently exposes an unauthenticated{" "}
            <a
              className="
                underline underline-offset-4
                hover:text-foreground
              "
              href="/api/health"
            >
              static deployment marker
            </a>
            . It confirms that the exported API file is reachable; it does not
            probe runtime dependencies. Limeplay does not currently publish
            webhooks or an MCP server.
          </p>
        </section>

        <section aria-labelledby="build-heading" className="mt-12">
          <h2
            className="text-xl font-semibold text-foreground"
            id="build-heading"
          >
            Build with Limeplay
          </h2>
          <ul className="mt-3 space-y-2 text-sm/7">
            <li>
              <Link
                className="
                  underline underline-offset-4
                  hover:text-foreground
                "
                href="/docs/quick-start"
              >
                Read the Limeplay quick start
              </Link>
            </li>
            <li>
              <Link
                className="
                  underline underline-offset-4
                  hover:text-foreground
                "
                href="/docs/ai-agents"
              >
                Read the AI agent installation guide
              </Link>
            </li>
            <li>
              <Link
                className="
                  underline underline-offset-4
                  hover:text-foreground
                "
                href="https://github.com/winoffrg/limeplay"
              >
                View the Limeplay source on GitHub
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
