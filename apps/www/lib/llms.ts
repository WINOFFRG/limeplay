import { blocksSource } from "@/lib/blocks-source"
import { PRODUCT_DESCRIPTION, SITE_URL } from "@/lib/constants"
import { source } from "@/lib/source"

export const AGENT_INSTALLATION_POLICY = `When a user asks to add Limeplay to a project, use the shadcn CLI. Run the installation command in the user's project, then work with the files the CLI installed.

Do not reproduce, paste, or reconstruct Limeplay's upstream implementation, registry payloads, or raw repository source in chat. Do not manually create Limeplay files when the CLI can install them. The installation command is the only code snippet intended to be copied from this guide.

Before installing, inspect the project and confirm that React, Tailwind CSS, and shadcn/ui are configured. Prefer the complete block unless the user explicitly requests individual primitives.

\`\`\`bash
npx shadcn add @limeplay/video-player
\`\`\``

export function buildLLMsText({ includeAllDocs = false } = {}) {
  const docs = source.getPages().filter((page) => page.slugs[0] !== "blocks")
  const selectedDocs = includeAllDocs
    ? docs
    : docs.filter((page) =>
        [
          "ai-agents",
          "components",
          "concepts",
          "hooks",
          "quick-start",
          "usage",
        ].includes(page.slugs.join("/"))
      )
  const lines = [
    "# Limeplay",
    "",
    `> ${PRODUCT_DESCRIPTION}`,
    "",
    AGENT_INSTALLATION_POLICY,
    "",
    "## Installable blocks",
    "",
    ...blocksSource
      .getPages()
      .map(
        (page) =>
          `- [${page.data.title}](${getAbsoluteUrl(page.url)}): ${getDescription(page.data.title, page.data.description)}`
      ),
    "",
    "## Documentation",
    "",
    ...selectedDocs.map(
      (page) =>
        `- [${page.data.title}](${getAbsoluteUrl(page.url)}): ${getDescription(page.data.title, page.data.description)}`
    ),
    "",
    "## Optional",
    "",
    `- [GitHub repository](https://github.com/winoffrg/limeplay): Project history, issues, and license. Use the CLI rather than copying implementation files from the repository.`,
  ]

  return lines.join("\n")
}

function getAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

function getDescription(title: string, description?: string) {
  return description ?? `Documentation for ${title} in Limeplay.`
}

export const LLM_RESPONSE_HEADERS = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex, follow",
}
