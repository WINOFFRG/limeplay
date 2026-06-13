import { renderMermaidSVG } from "beautiful-mermaid"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"

export async function Mermaid({ chart }: { chart: string }) {
  try {
    const svg = renderMermaidSVG(chart, {
      accent: "var(--color-fd-primary)",
      bg: "transparent",
      border: "color-mix(in oklab, var(--color-fd-border) 86%, transparent)",
      fg: "var(--color-fd-foreground)",
      font: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
      interactive: true,
      layerSpacing: 52,
      line: "color-mix(in oklab, var(--color-fd-muted-foreground) 58%, transparent)",
      muted: "var(--color-fd-muted-foreground)",
      nodeSpacing: 36,
      padding: 32,
      surface:
        "color-mix(in oklab, var(--color-fd-card) 92%, var(--color-fd-primary) 8%)",
      transparent: true,
    })

    return (
      <figure className="not-prose my-8 overflow-hidden rounded-2xl border bg-fd-card/70 shadow-sm ring-1 ring-fd-border/40">
        <div
          className="
            overflow-x-auto p-4
            sm:p-6
          "
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </figure>
    )
  } catch {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    )
  }
}
