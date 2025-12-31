import { Menu } from "lucide-react"
import Link from "next/link"

import { NavTabs } from "@/components/nav-tabs"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"

const navLinks = [
  { href: "/docs", label: "Documentation" },
  {
    href: "https://github.com/winoffrg/limeplay",
    label: "Github",
    target: "_blank",
  },
  {
    href: "https://limeplay.userjot.com/roadmap",
    label: "Roadmap",
  },
]

export function Header() {
  return (
    <header
      className={`top-0 right-0 left-0 z-20 flex w-full flex-row items-center justify-center border-b border-border px-page backdrop-blur-xl`}
    >
      <div
        className={`relative z-1 mx-auto flex w-full max-w-5xl origin-center flex-row items-center justify-center border-x border-border py-3`}
      >
        <div className="z-300 flex w-full max-w-5xl shrink-0 flex-row items-center justify-between gap-2 rounded-lg px-2">
          <Link className="flex flex-1 shrink-0 px-1" href="/">
            <LimeplayLogo className="size-6! shrink-0 text-foreground/80" />
          </Link>
          <div
            className={`
              hidden flex-none flex-row items-center justify-center gap-1
              md:flex md:flex-1
            `}
          >
            <NavTabs tabs={navLinks} />
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 px-0">
            <Button
              className={`
                hidden h-7 gap-1.5 rounded-md bg-background px-2.5 text-sm font-medium text-foreground/90 ring ring-border
                hover:bg-background hover:text-foreground
                md:flex
              `}
              disabled
              size="sm"
            >
              Coming Soon
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className={`
                    size-8
                    md:hidden
                  `}
                  size="icon"
                  variant="ghost"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  {navLinks.map((link) => (
                    <Link
                      className={`
                        text-sm font-medium transition-colors
                        hover:text-primary
                      `}
                      href={link.href}
                      key={link.href}
                      target={link.target}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className={`
                        h-9 gap-1.5 rounded-md bg-background px-2.5 text-sm font-medium text-foreground/90 ring ring-border
                        hover:bg-background hover:text-foreground
                      `}
                      disabled
                      size="sm"
                    >
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
