import Link from "next/link"

import { HOME_AGENT_SECTIONS } from "@/lib/agent-content"

export function HomeNoscriptContent() {
  return (
    <noscript>
      <section className="mx-auto w-full max-w-5xl border-x border-border px-page py-16">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Build React media players with Limeplay
        </h2>
        <p className="mt-4 max-w-3xl text-base/7 text-muted-foreground">
          Limeplay is an open-source collection of video and audio player UI
          components powered by Shaka Player and installed through the shadcn
          CLI. This server-rendered guide remains available when JavaScript is
          disabled.
        </p>
        <div
          className="
            mt-8 grid gap-7
            md:grid-cols-2
          "
        >
          {HOME_AGENT_SECTIONS.map((section) => (
            <article key={section.title}>
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <p className="mt-2 text-sm/7 text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <Link href="/docs/quick-start">Read the quick start</Link>
          <Link href="/developers">Browse developer resources</Link>
          <Link href="/llms.txt">Open the agent index</Link>
        </p>
      </section>
    </noscript>
  )
}
