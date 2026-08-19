import type { source } from "@/lib/source"

import { AGENT_INSTALLATION_POLICY } from "@/lib/llms"

type Page = NonNullable<ReturnType<typeof source.getPage>>

export async function getLLMText(page: Page) {
  if ((page.data as { type?: string }).type === "openapi") return ""

  const category =
    {
      architecture: "Limeplay Architecture",
      components: "Limeplay UI Components",
      hooks: "Limeplay Hooks",
      "quick-start": "Limeplay Quick Start",
      "what-is-limeplay": "Limeplay Introduction",
    }[page.slugs[0] ?? ""] ?? page.slugs[0]

  const processed = keepInstallationCommands(
    await (
      page.data as { getText: (format: string) => Promise<string> }
    ).getText("processed")
  )

  return `# ${category}: ${page.data.title}
URL: ${page.url}

${page.data.description ?? ""}

## Agent installation policy

${AGENT_INSTALLATION_POLICY}

## Reference

${processed}`
}

function keepInstallationCommands(markdown: string) {
  return markdown.replace(
    /```[^\n]*\n([\s\S]*?)```/g,
    (_codeBlock, code: string) => {
      const installationCommands = code
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("npx shadcn"))

      if (installationCommands.length === 0) {
        return "_Implementation example omitted. Install the block with the shadcn CLI._"
      }

      return `\`\`\`bash\n${installationCommands.join("\n")}\n\`\`\``
    }
  )
}
