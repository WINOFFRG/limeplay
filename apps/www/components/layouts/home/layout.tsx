import { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"
import { NavProvider } from "@/components/contexts/layout"
import { HEADER_LINKS } from "@/app/layout.config"

import { Header, HomeLayoutProps } from "../header"
import { slot } from "../shared"

export function HomeLayout(
  props: HomeLayoutProps & HTMLAttributes<HTMLElement>
) {
  const { nav, ...rest } = props

  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <main
        id="nd-home-layout"
        {...rest}
        className={cn("flex flex-1 flex-col pt-14", rest.className)}
      >
        {slot(nav, <Header links={HEADER_LINKS} nav={nav} />)}
        {props.children}
      </main>
    </NavProvider>
  )
}
