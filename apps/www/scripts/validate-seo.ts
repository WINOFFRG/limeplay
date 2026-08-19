import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const outputDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "out"
)
const siteUrl = "https://limeplay.winoffrg.dev"
const failures: string[] = []

function expect(content: string, value: string, context: string) {
  if (!content.includes(value)) {
    failures.push(`${context} is missing ${JSON.stringify(value)}`)
  }
}

function parseJsonLd(html: string, context: string) {
  const scripts = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    ),
  ]

  if (scripts.length === 0) {
    failures.push(`${context} is missing server-rendered JSON-LD`)
  }

  return scripts.flatMap((script) => {
    try {
      return [JSON.parse(script[1]) as { "@type"?: string }]
    } catch {
      failures.push(`${context} contains invalid JSON-LD`)
      return []
    }
  })
}

function readOutput(path: string) {
  const outputPath = join(outputDirectory, path)

  if (!existsSync(outputPath)) {
    failures.push(`Missing exported file: ${path}`)
    return ""
  }

  return readFileSync(outputPath, "utf8")
}

function reject(content: string, value: string, context: string) {
  if (content.includes(value)) {
    failures.push(`${context} must not contain ${JSON.stringify(value)}`)
  }
}

const sitemap = readOutput("sitemap.xml")
expect(sitemap, `<loc>${siteUrl}</loc>`, "sitemap.xml")
expect(sitemap, `<loc>${siteUrl}/blocks/video-player</loc>`, "sitemap.xml")
expect(sitemap, `<loc>${siteUrl}/blocks/audio-player</loc>`, "sitemap.xml")
reject(sitemap, `<loc>${siteUrl}/docs</loc>`, "sitemap.xml")
reject(sitemap, "<changefreq>", "sitemap.xml")
reject(sitemap, "<priority>", "sitemap.xml")

const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1]
)

if (new Set(sitemapUrls).size !== sitemapUrls.length) {
  failures.push("sitemap.xml contains duplicate URLs")
}

for (const sitemapUrl of sitemapUrls) {
  const url = new URL(sitemapUrl)
  const outputPath =
    url.pathname === "/" ? "index.html" : `${url.pathname.slice(1)}.html`
  const html = readOutput(outputPath)

  expect(html, `<link rel="canonical" href="${sitemapUrl}"`, outputPath)
  expect(html, '<meta name="description" content="', outputPath)
  reject(html, "http://localhost", outputPath)
  reject(html, '<meta name="robots" content="noindex', outputPath)
}

const robots = readOutput("robots.txt")
expect(robots, `Sitemap: ${siteUrl}/sitemap.xml`, "robots.txt")
expect(robots, "User-Agent: OAI-SearchBot", "robots.txt")
expect(robots, "User-Agent: Claude-SearchBot", "robots.txt")
expect(robots, "User-Agent: PerplexityBot", "robots.txt")
expect(robots, "User-Agent: GPTBot", "robots.txt")
expect(robots, "User-Agent: ClaudeBot", "robots.txt")
expect(robots, "User-Agent: Google-Extended", "robots.txt")

for (const [path, canonical] of [
  ["index.html", siteUrl],
  ["docs/quick-start.html", `${siteUrl}/docs/quick-start`],
  ["blocks/video-player.html", `${siteUrl}/blocks/video-player`],
] as const) {
  const html = readOutput(path)
  expect(html, `<link rel="canonical" href="${canonical}"`, path)
  expect(html, '<meta name="description" content="', path)
  reject(html, "http://localhost", path)
}

const llmsText = readOutput("llms.txt")
expect(llmsText, "npx shadcn add @limeplay/video-player", "llms.txt")
expect(llmsText, "Do not reproduce", "llms.txt")
reject(llmsText, "raw.githubusercontent.com", "llms.txt")

const llmsFullText = readOutput("llms-full.txt")
expect(llmsFullText, "npx shadcn add @limeplay/video-player", "llms-full.txt")
expect(llmsFullText, "Do not reproduce", "llms-full.txt")
reject(llmsFullText, "raw.githubusercontent.com", "llms-full.txt")

for (const [path, content] of [
  ["llms.txt", llmsText],
  ["llms-full.txt", llmsFullText],
] as const) {
  if ((content.match(/```/g) ?? []).length !== 2) {
    failures.push(`${path} must contain only the installation code block`)
  }
}

const pageMarkdown = readOutput("llms.mdx/quick-start.mdx")
expect(pageMarkdown, "Do not reproduce", "llms.mdx/quick-start.mdx")
reject(pageMarkdown, "raw.githubusercontent.com", "llms.mdx/quick-start.mdx")
reject(pageMarkdown, "import {", "llms.mdx/quick-start.mdx")
reject(pageMarkdown, "export function", "llms.mdx/quick-start.mdx")

if (Buffer.byteLength(llmsFullText, "utf8") > 50_000) {
  failures.push("llms-full.txt must stay below 50 KB")
}

const homeJsonLdTypes = parseJsonLd(readOutput("index.html"), "index.html").map(
  (schema) => schema["@type"]
)
const docsJsonLdTypes = parseJsonLd(
  readOutput("docs/quick-start.html"),
  "docs/quick-start.html"
).map((schema) => schema["@type"])

for (const schemaType of ["Organization", "SoftwareSourceCode", "WebSite"]) {
  if (!homeJsonLdTypes.includes(schemaType)) {
    failures.push(`index.html is missing ${schemaType} JSON-LD`)
  }
}

for (const schemaType of ["BreadcrumbList", "TechArticle"]) {
  if (!docsJsonLdTypes.includes(schemaType)) {
    failures.push(`docs/quick-start.html is missing ${schemaType} JSON-LD`)
  }
}

if (failures.length > 0) {
  console.error(`SEO validation failed:\n- ${failures.join("\n- ")}`)
  process.exit(1)
}

console.log("SEO validation passed")
