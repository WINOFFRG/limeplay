"use client"

import { Suspense } from "react"

import { Index } from "@/registry/__index__"

export function ProYouTubeMusicPlayer() {
  const proRegistry = Index["pro"]
  const youtubeMusicEntry = proRegistry?.["youtube-music"]

  if (!youtubeMusicEntry?.component) {
    return null
  }

  const Component = youtubeMusicEntry.component

  return (
    <Suspense fallback={null}>
      <div className="dark">
        <Component />
      </div>
    </Suspense>
  )
}
