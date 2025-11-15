import type { ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"

import type { LinkItemType } from "@/components/layouts/links"

export interface NavOptions {
  enabled: boolean
  component: ReactNode

  title?: ReactNode

  /**
   * Redirect url of title
   * @defaultValue '/'
   */
  url?: string

  children?: ReactNode
}

export interface BaseLayoutProps {
  themeSwitch?: {
    enabled?: boolean
    component?: ReactNode
    mode?: "light-dark" | "light-dark-system"
  }

  searchToggle?: Partial<{
    enabled: boolean
    components: Partial<{
      sm: ReactNode
      lg: ReactNode
    }>
  }>

  links: LinkItemType[]
  /**
   * Replace or disable navbar
   */
  nav?: Partial<NavOptions>

  children?: ReactNode
}

export { type LinkItemType }

export function slot(
  obj:
    | {
        enabled?: boolean
        component?: ReactNode
      }
    | undefined,
  def: ReactNode,
  customComponentProps?: object,
  disabled?: ReactNode
): ReactNode {
  if (obj?.enabled === false) return disabled
  if (obj?.component !== undefined)
    return <Slot {...customComponentProps}>{obj.component}</Slot>

  return def
}
