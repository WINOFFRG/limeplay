import type { ReactNode } from "react"

import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"

export function BlockPreviewPane({ children }: { children: ReactNode }) {
  return (
    <section
      className={`
        relative z-10 grid h-full min-h-[52svh] w-full min-w-0 grid-cols-1 items-center justify-center p-2 pl-0
        lg:min-h-screen
      `}
      id="preview"
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-muted">
        <div className="relative flex size-full items-end justify-center overflow-hidden">
          <LimeplayLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          {children}
        </div>
      </div>
    </section>
  )
}
