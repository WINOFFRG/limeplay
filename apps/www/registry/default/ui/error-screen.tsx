"use client"

import type { ComponentPropsWithoutRef } from "react"

import * as React from "react"
import shaka from "shaka-player"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "@/lib/utils"

const MEDIA_ERROR_MAP: Record<number, { code: string; title: string }> = {
  1: { code: "MEDIA_ERR_ABORTED", title: "Playback aborted" },
  2: { code: "MEDIA_ERR_NETWORK", title: "Unable to connect" },
  3: { code: "MEDIA_ERR_DECODE", title: "Playback error" },
  4: { code: "MEDIA_ERR_SRC_NOT_SUPPORTED", title: "Format not supported" },
}

const SHAKA_CATEGORY_MAP: Record<number, string> = {
  1: "Network error",
  2: "Text error",
  3: "Media error",
  4: "Manifest error",
  5: "Streaming error",
  6: "DRM error",
  7: "Player error",
  8: "Cast error",
  9: "Storage error",
}

const SHAKA_DOCS_BASE =
  "https://shaka-player-demo.appspot.com/docs/api/shaka.util.Error.html"

export interface ErrorDetails {
  code: string
  description: string
  shakaDocsUrl?: string
  title: string
}

interface ErrorScreenProps extends ComponentPropsWithoutRef<"div"> {
  error?: unknown
  message?: string
}

export function getErrorDetails(error: unknown): ErrorDetails {
  if (!error) {
    return {
      code: "ERR_UNKNOWN",
      description:
        "Something went wrong during playback. Please try again or check your connection.",
      title: "Something went wrong",
    }
  }

  if (isMediaError(error)) {
    const mapped = MEDIA_ERROR_MAP[error.code]
    return {
      code: mapped.code,
      description:
        error.code === 2
          ? "There was an issue connecting with the stream. Please check your internet connection and try again."
          : "This content could not be played. Try a different stream or check your connection.",
      title: mapped.title,
    }
  }

  if (isShakaError(error)) {
    const categoryLabel =
      SHAKA_CATEGORY_MAP[error.category] ?? `Category ${error.category}`
    const isNetwork = error.category === 1
    return {
      code: `SHAKA-${error.category}_${error.code}`,
      description: isNetwork
        ? "There was an issue connecting with the stream. Please check your internet connection and try again."
        : `A ${categoryLabel.toLowerCase()} occurred while loading content. Try a different stream or check your connection.`,
      shakaDocsUrl: `${SHAKA_DOCS_BASE}#:~:text=${error.code}`,
      title: isNetwork ? "Unable to connect" : categoryLabel,
    }
  }

  return {
    code: "ERR_PLAYBACK",
    description:
      "This content could not be played. Try a different stream or check your connection.",
    title: "Playback error",
  }
}

export function isMediaError(error: unknown): error is MediaError {
  return typeof MediaError !== "undefined" && error instanceof MediaError
}

export function isShakaError(
  error: unknown
): error is {
  category: number
  code: number
  message: string
  severity: number
} {
  return error instanceof shaka.util.Error
}

export const ErrorScreen = React.forwardRef<HTMLDivElement, ErrorScreenProps>(
  ({ children, className, error, message, ...props }, ref) => {
    const details = getErrorDetails(error)

    return (
      <div
        className={cn(
          "absolute inset-0 z-50 flex items-center justify-center bg-background text-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        <Item
          className={`
            max-w-md px-4
            sm:px-8
          `}
        >
          <ItemContent
            className={`
              gap-1.5
              sm:gap-2
            `}
          >
            <ItemTitle
              className={`
                text-sm font-semibold
                sm:text-base
              `}
            >
              {message ?? details.title}
            </ItemTitle>
            <ItemDescription
              className={`
                text-xs font-medium text-muted-foreground
                sm:text-sm
              `}
            >
              Error code: {details.code}
            </ItemDescription>
            <ItemDescription
              className={`
                text-xs leading-relaxed text-muted-foreground/60
                sm:text-sm
              `}
            >
              {details.description}
            </ItemDescription>
          </ItemContent>
          {children && (
            <ItemActions className="basis-full">{children}</ItemActions>
          )}
        </Item>
      </div>
    )
  }
)

ErrorScreen.displayName = "ErrorScreen"
