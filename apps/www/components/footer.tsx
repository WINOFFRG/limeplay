import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="mx-auto w-full border-t border-tertiary px-4">
      <div className="relative z-1 mx-auto w-full max-w-5xl border-x border-tertiary">
        <div
          className={`
            flex w-full flex-col items-center gap-6 py-12
            md:py-20
          `}
        >
          <div className="flex flex-row items-center gap-2">
            <Button asChild size="xs" variant="ghost">
              <Link
                href="https://limeplay.userjot.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Give Feedback
              </Link>
            </Button>
            <Button asChild size="xs" variant="ghost">
              <Link
                href="https://x.com/winoffrg"
                rel="noopener noreferrer"
                target="_blank"
              >
                Reach out on X
              </Link>
            </Button>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              © {new Date().getFullYear()} Limeplay
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
