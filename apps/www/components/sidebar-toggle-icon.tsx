"use client"

import { motion } from "motion/react"

// Outer rounded rectangle — fill + stroke, common to both states
const OUTER =
  "M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.2288 21 5.3431 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z"

// Narrow left column (right edge at x = 10) — closed state
const PANEL_CLOSED =
  "M10 5.5 C10 4.793 10 4.439 9.780 4.220 C9.560 4 9.207 4 8.5 4 H8.5 C6.379 4 5.318 4 4.659 4.659 C4 5.318 4 6.379 4 8.5 V15.5 C4 17.621 4 18.682 4.659 19.341 C5.318 20 6.379 20 8.5 20 H8.5 C9.207 20 9.561 20 9.780 19.780 C10 19.561 10 19.207 10 18.5 V5.5 Z"

// Wide left panel (right edge at x = 14) — open state
const PANEL_OPEN =
  "M14 6 C14 5.057 14 4.586 13.707 4.293 C13.414 4 12.943 4 12 4 H10 C7.172 4 5.757 4 4.879 4.879 C4 5.757 4 7.172 4 10 V14 C4 16.828 4 18.243 4.879 19.121 C5.757 20 7.172 20 10 20 H12 C12.943 20 13.414 20 13.707 19.707 C14 19.414 14 18.943 14 18 V6 Z"

export interface SidebarToggleIconProps {
  /** Extra classes applied to the `<svg>` element. */
  className?: string
  /** Whether the sidebar panel is open. Controls the morphed path. */
  isOpen: boolean
  /** SVG stroke width. @default 1.5 */
  strokeWidth?: number
}

export function SidebarToggleIcon({
  className,
  isOpen,
  strokeWidth = 1.5,
}: SidebarToggleIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer border — foreground fill + stroke */}
      <path
        d={OUTER}
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />

      {/* Inner panel — pure path morph, no opacity / translate tricks */}
      <motion.path
        animate={{ d: isOpen ? PANEL_OPEN : PANEL_CLOSED }}
        style={{ fill: "var(--background)" }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />
    </svg>
  )
}
