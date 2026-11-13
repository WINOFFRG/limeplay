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
  const resetTimeoutRef = React.useRef<null | ReturnType<typeof setTimeout>>(
    null
  )

  React.useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    },
    []
  )

  /**
   * Writes `value` to the clipboard. Resolves to `true` on success and
   * `false` when the clipboard is unavailable or the write fails.
   */
  const copyToClipboard = async (value: string): Promise<boolean> => {
    if (typeof window === "undefined" || !value) {
      return false
    }

    const clipboard = "clipboard" in navigator ? navigator.clipboard : null
    if (!clipboard) return false

    try {
      await clipboard.writeText(value)
    } catch (error) {
      console.error(error)
      return false
    }

    setIsCopied(true)
    onCopy?.()

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
    }
    resetTimeoutRef.current = setTimeout(() => {
      setIsCopied(false)
      resetTimeoutRef.current = null
    }, timeout)

    return true
  }

  return { copyToClipboard, isCopied }
}
