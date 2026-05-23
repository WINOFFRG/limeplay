import type { ReactNode } from "react"

import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"

export function BlockPreviewPane({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-full items-center justify-center overflow-hidden bg-muted">
      <div className="relative flex size-full items-end justify-center overflow-hidden">
        <LimeplayLogo className="absolute top-1/2 left-1/2 -translate-1/2" />
        {children}
      </div>
    </div>
  )
}
