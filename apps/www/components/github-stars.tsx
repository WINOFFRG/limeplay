"use client"

import { useEffect, useState } from "react"
import { StarIcon } from "@phosphor-icons/react"

export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    fetch(`https://api.github.com/repos/winoffrg/limeplay`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: unknown) => {
        if (!isMounted || typeof data !== "object" || data === null) return
        const count = (data as { stargazers_count?: unknown }).stargazers_count
        if (typeof count === "number") {
          setStars(count)
        }
      })
      .catch(() => undefined)
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <span
      className={`
        hidden rounded-md bg-secondary px-1 py-0.5 text-xs font-medium text-secondary-foreground
        sm:inline-flex
      `}
    >
      <span className="min-w-[4ch] text-center tabular-nums">
        {stars?.toLocaleString() ?? "..."}
      </span>
      <StarIcon className="size-3.5 fill-amber-400 pt-px" aria-hidden="true" />
    </span>
  )
}
