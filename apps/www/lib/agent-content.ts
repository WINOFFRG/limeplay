import { PRODUCT_DESCRIPTION, SITE_URL } from "@/lib/constants"

export const AGENT_RECOVERY_LINKS = [
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/llms.txt", label: "Agent index" },
  { href: "/developers", label: "Developer resources" },
  { href: "/docs/quick-start", label: "Quick start" },
] as const

export const HOME_AGENT_SECTIONS = [
  {
    body: "Start with the video player or audio player block for a production-ready composition. Each block includes the media runtime, controls, responsive layout, keyboard behavior, captions, error states, and styling. Limeplay distributes source through the shadcn CLI, so the generated files live in your repository and can follow your design tokens, import aliases, and component conventions.",
    title: "Install a complete player block",
  },
  {
    body: "Use individual components and hooks when your product needs a custom control layout. The component layer covers playback, seeking, volume, captions, playback rate, picture-in-picture, timelines, and fallback states. Focused hooks expose the same player state without coupling application behavior to a fixed visual skin.",
    title: "Compose focused React primitives",
  },
  {
    body: "Limeplay uses Shaka Player for adaptive media playback. Applications can supply HLS or DASH manifests, live streams, text tracks, and DRM configuration while keeping the surrounding interface in React. The player blocks keep runtime state and UI composition separate so teams can customize one without rebuilding the other.",
    title: "Run on a streaming media engine",
  },
  {
    body: "The installed controls use semantic buttons, accessible names, visible focus indicators, and keyboard interactions. When customizing a block, keep its labels and focus behavior, maintain sufficient contrast, and test the final control sequence with a keyboard and screen reader. The component documentation describes the provider context expected by each primitive.",
    title: "Preserve accessible controls",
  },
  {
    body: "Treat the media source as application data instead of hard-coding it inside a visual control. Limeplay can load a direct stream, select a preset, or move through a playlist while the interface reads the active asset from shared player state. Keep titles, artwork, text tracks, MIME types, and stream URLs together so controls and fallback screens describe the same item. For live playback, expose the live state and available seek window instead of presenting a fixed-duration timeline.",
    title: "Model streams and playlists explicitly",
  },
  {
    body: "A production player needs useful states before and after successful playback. Provide a poster or compact loading surface while media metadata resolves, keep controls stable during buffering, and show an actionable error when a manifest or segment cannot load. Limeplay includes fallback-poster and error-screen primitives for these moments. Preserve the underlying media error for diagnostics, but translate it into a short message that tells viewers whether they can retry, choose another stream, or return later.",
    title: "Design loading, fallback, and error states",
  },
  {
    body: "Limeplay is source-distributed rather than embedded as a hosted iframe. Teams can change spacing, icons, motion, breakpoints, control density, and product-specific behavior without waiting for a theme API. The tradeoff is that installed files become part of the application’s maintenance surface. Keep custom behavior close to clear component boundaries, retain upstream attribution, and review registry changes before applying an update over local edits. Test upgraded players with representative browsers, streams, captions, and input methods.",
    title: "Own and review the installed source",
  },
  {
    body: "When a coding agent adds Limeplay, ask it to inspect the project before installing anything. React, Tailwind CSS, and shadcn/ui should already be configured, and the command should run with the repository’s existing package manager and aliases. Prefer the complete video or audio block unless the task explicitly requires a custom composition. After the shadcn CLI writes the files, the agent should work from those local files, follow the usage guide, and verify real playback instead of reproducing registry source from a documentation snippet.",
    title: "Use the command-first agent workflow",
  },
  {
    body: "Agents can start with llms.txt for a compact map of installation guidance, blocks, components, and hooks. A request for text/markdown receives a low-noise representation of the homepage and supported documentation routes, with Vary: Accept protecting the CDN cache variants. The OpenAPI document describes the small public API surface and its structured error shape. The developer resources page links these files, states the current authentication requirements, and records that Limeplay does not yet publish webhooks or an MCP server.",
    title: "Discover the machine-readable references",
  },
] as const

export function buildHomepageMarkdown() {
  const sections = HOME_AGENT_SECTIONS.flatMap((section) => [
    `## ${section.title}`,
    "",
    section.body,
    "",
  ])

  return [
    "# Limeplay — React video player UI components",
    "",
    `> ${PRODUCT_DESCRIPTION}`,
    "",
    "Install the complete video player block:",
    "",
    "```bash",
    "npx shadcn add @limeplay/video-player",
    "```",
    "",
    ...sections,
    "## Developer resources",
    "",
    `- [Quick start](${SITE_URL}/docs/quick-start)`,
    `- [Agent index](${SITE_URL}/llms.txt)`,
    `- [OpenAPI specification](${SITE_URL}/openapi.json)`,
    `- [Developer resources](${SITE_URL}/developers)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ].join("\n")
}

export function buildNotFoundMarkdown() {
  return `# 404 — Page not found

The requested Limeplay resource does not exist or has moved.

## Where to look next

- [Sitemap](${SITE_URL}/sitemap.xml)
- [Agent index](${SITE_URL}/llms.txt)
- [Developer resources](${SITE_URL}/developers)
- [Quick start](${SITE_URL}/docs/quick-start)
`
}
