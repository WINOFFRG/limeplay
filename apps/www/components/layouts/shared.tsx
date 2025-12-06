import type { ReactNode } from "react"

import { Slot } from "@radix-ui/react-slot"

import type { LinkItemType } from "@/components/layouts/links"

export interface BaseLayoutProps {
  children?: ReactNode

  links: LinkItemType[]

  /**
   * Replace or disable navbar
   */
  nav?: Partial<NavOptions>
  searchToggle?: Partial<{
    components: Partial<{
      lg: ReactNode
      sm: ReactNode
    }>
    enabled: boolean
  }>

  themeSwitch?: {
    component?: ReactNode
    enabled?: boolean
    mode?: "light-dark" | "light-dark-system"
  }
}

export interface NavOptions {
  children?: ReactNode
  component: ReactNode

  enabled: boolean

  title?: ReactNode

  /**
   * Redirect url of title
   * @defaultValue '/'
   */
  url?: string
}

export { type LinkItemType }

export function slot(
  obj:
    | undefined
    | {
        component?: ReactNode
        enabled?: boolean
      },
  def: ReactNode,
  customComponentProps?: object,
  disabled?: ReactNode
): ReactNode {
  if (obj?.enabled === false) return disabled
  if (obj?.component !== undefined)
    return <Slot {...customComponentProps}>{obj.component}</Slot>

  return def
}
