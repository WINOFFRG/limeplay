"use client"

import { motion, useAnimationControls } from "motion/react"
import Link from "next/link"
import { useRef } from "react"

interface NavTab {
  href: string
  icon?: React.ReactNode
  label: string
  target?: string
}

interface NavTabsProps {
  tabs: NavTab[]
}

export function NavTabs({ tabs }: NavTabsProps) {
  const navContainerRef = useRef<HTMLElement>(null)
  const hoveredElementRef = useRef<HTMLElement | null>(null)
  const animationControls = useAnimationControls()

  const handleMouseEnter = async (target: HTMLElement) => {
    if (!navContainerRef.current) return

    const containerRect = navContainerRef.current.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const leftOffset = targetRect.left - containerRect.left

    if (hoveredElementRef.current) {
      hoveredElementRef.current = target
      animationControls.start({
        filter: "blur(0px)",
        height: "100%",
        left: `${leftOffset}px`,
        opacity: 1,
        scale: 1,
        top: 0,
        transition: { duration: 0.3, ease: "easeOut" },
        width: `${targetRect.width}px`,
      })
    } else {
      animationControls.set({
        filter: "blur(2px)",
        height: "100%",
        left: `${leftOffset}px`,
        opacity: 0,
        scale: 1.5,
        transformOrigin: "center",
        width: `${targetRect.width}px`,
      })
      hoveredElementRef.current = target
      animationControls.start({
        filter: "blur(0px)",
        height: "100%",
        left: `${leftOffset}px`,
        opacity: 1,
        scale: 1,
        top: 0,
        transition: { duration: 0.3, ease: "easeOut" },
        width: `${targetRect.width}px`,
      })
    }
  }

  const handleMouseLeave = () => {
    hoveredElementRef.current = null
    animationControls.start({
      filter: "blur(2px)",
      opacity: 0,
      scale: 1.5,
      transition: { duration: 0.3, ease: "easeOut" },
    })
  }

  return (
    <nav
      className="relative"
      onMouseLeave={handleMouseLeave}
      ref={navContainerRef}
    >
      <motion.div
        animate={animationControls}
        className="absolute top-0 rounded-md bg-foreground/10"
      />
      <ul className="relative z-10 flex items-center gap-1">
        {tabs.map((tab) => (
          <li key={tab.label}>
            <Link
              className={`
                flex h-7 items-center gap-2 rounded-full px-3 text-sm font-medium text-foreground/70 transition-colors duration-200
                hover:text-foreground
              `}
              href={tab.href}
              onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
              target={tab.target}
            >
              {tab.icon && <span className="!size-5 shrink-0">{tab.icon}</span>}
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
