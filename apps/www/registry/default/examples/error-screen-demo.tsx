"use client"

import { ExternalLinkIcon, RotateCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ErrorScreen,
  getErrorDetails,
  type ShakaErrorLike,
} from "@/registry/default/ui/error-screen"

const demoError: ShakaErrorLike = {
  category: 1,
  code: 1001,
  message: "Request failed while fetching the manifest.",
  severity: 2,
}

export default function ErrorScreenDemo() {
  const details = getErrorDetails(demoError)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-black">
      <ErrorScreen
        className="rounded-xl bg-background/95 backdrop-blur-sm"
        error={demoError}
      >
        <div className="flex flex-wrap gap-3">
          <Button size="sm">
            <RotateCwIcon />
            Retry
          </Button>
          {details.shakaDocsUrl && (
            <Button asChild size="sm" variant="secondary">
              <a
                href={details.shakaDocsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLinkIcon />
                Shaka Error
              </a>
            </Button>
          )}
        </div>
      </ErrorScreen>
    </div>
  )
}