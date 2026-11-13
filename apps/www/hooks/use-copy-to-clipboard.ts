"use client"

import * as React from "react"

export function useCopyToClipboard({
  onCopy,
  timeout = 2000,
}: {
  onCopy?: () => void
  timeout?: number
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined") {
      return
    }

    const clipboard = "clipboard" in navigator ? navigator.clipboard : null
    if (!clipboard) return

    if (!value) return

    clipboard.writeText(value).then(() => {
      setIsCopied(true)

      if (onCopy) {
        onCopy()
      }

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    }, console.error)
  }

  return { copyToClipboard, isCopied }
}
