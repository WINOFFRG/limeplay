import type { source } from "@/lib/source"

type Page = NonNullable<ReturnType<typeof source.getPage>>

export async function getLLMText(page: Page) {
  if ((page.data as { type?: string }).type === "openapi") return ""

  const category =
    {
      components: "Limeplay UI Components",
      hooks: "Limeplay Hooks",
      "quick-start": "Limeplay Quick Start",
      "what-is-limeplay": "Limeplay Introduction",
      architecture: "Limeplay Architecture",
    }[page.slugs[0] ?? ""] ?? page.slugs[0]

  const processed = await (
    page.data as { getText: (format: string) => Promise<string> }
  ).getText("processed")

  return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/winoffrg/limeplay/refs/heads/main/apps/www/content/docs/${page.path}

${page.data.description ?? ""}
        
${processed}`
}
