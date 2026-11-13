"use client"

import type { ReactNode } from "react"

import { Suspense } from "react"

import { Index } from "@/registry/__index__"

type ProBlockComponent = React.ComponentType<{
  children?: ReactNode
  layout?: "fill"
}>

/**
 * Renders a pro block from the generated registry index.
 *
 * Pro blocks live in the private `registry/pro` submodule, so they are read
 * from `Index.pro` (generated only when the submodule is present) instead of
 * being imported directly. Builds without the submodule show a notice.
 */
export function ProBlockPreview({
  children,
  name,
}: {
  children?: ReactNode
  name: string
}) {
  // `Index.pro` only exists when the pro submodule was present at registry build time.
  const proIndex = Index.pro as
    | Record<string, undefined | { component?: null | ProBlockComponent }>
    | undefined
  const Component = proIndex?.[name]?.component

  if (!Component) {
    return (
      <div className="flex size-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        This pro block preview is unavailable in this build.
      </div>
    )
  }

  return (
    <Suspense fallback={null}>
      <Component layout="fill">{children}</Component>
    </Suspense>
  )
}
