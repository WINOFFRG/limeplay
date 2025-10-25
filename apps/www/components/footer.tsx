import Link from "next/link"

const links = [
  {
    title: "X",
    href: "https://x.com/winoffrg",
  },
  {
    title: "Github",
    href: "https://github.com/winoffrg/limeplay",
  },
  {
    title: "Components",
    href: "/docs/components",
  },
  {
    title: "Get Started",
    href: "/docs/quick-start",
  },
  {
    title: "Blocks",
    href: "/blocks",
  },
]

export function Footer() {
  return (
    <footer
        className={`
          border-b bg-white py-12
          dark:bg-transparent
        `}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap justify-between gap-6">
            <span
              className={`
                order-last block text-center text-sm text-muted-foreground
                md:order-first
              `}
            >
              © {new Date().getFullYear()} Limeplay, All rights reserved
            </span>
            <div
              className={`
                order-first flex flex-wrap justify-center gap-6 text-sm
                md:order-last
              `}
            >
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`
                    block text-muted-foreground duration-150
                    hover:text-black
                  `}
                >
                  <span>{link.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
  )
}
