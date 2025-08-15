"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"

import { useIsMobile } from "@/hooks/use-mobile"

interface ImmersiveScrollPlayerProps {
  children: React.ReactNode
}

function useViewportSize() {
  const [size, setSize] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    const update = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    update()
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
    }
  }, [])

  return size
}

export function ImmersiveScrollPlayer({
  children,
}: ImmersiveScrollPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLocked, setIsLocked] = useState(false)
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  useEffect(() => {
    if (isMobile) return

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress >= 0.65 && !isLocked) {
        setIsLocked(true)
        const container = containerRef.current
        if (container) {
          const rect = container.getBoundingClientRect()
          const scrollTarget = window.scrollY + rect.bottom - window.innerHeight
          window.scrollTo({
            top: scrollTarget,
            behavior: "smooth",
          })
        }
      } else if (progress < 0.65 && isLocked) {
        setIsLocked(false)
      }
    })

    return unsubscribe
  }, [scrollYProgress, isLocked, isMobile])

  const { width: vw, height: vh } = useViewportSize()

  const [initialWidthPx, midWidthPx, finalWidthPx] = useMemo(() => {
    const fitByHeight = Math.round((vh * 16) / 9)
    const fitWidth = Math.min(vw, fitByHeight) // contain: fit within viewport bounds
    const initial = Math.min(1080, Math.max(320, Math.round(fitWidth * 0.6)))
    const mid = Math.min(1920, Math.round(fitWidth * 0.96))
    const final = fitWidth
    return [initial, mid, final]
  }, [vw, vh])

  const width = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [initialWidthPx, midWidthPx, finalWidthPx]
  )

  // Animate background to black when scroll reaches 100%
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.95, 1],
    ["rgba(255, 255, 255, 0)", "rgba(0, 0, 0, 1)"]
  )

  if (isMobile) {
    return (
      <div className="relative w-full" ref={containerRef}>
        <div className="aspect-video w-full">{children}</div>
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[280vh]"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08, when: "beforeChildren" },
        },
      }}
      initial="hidden"
      animate="show"
    >
      <div className="sticky top-0 md:-mt-28 grid h-svh w-full place-items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ backgroundColor }}
        />
        <motion.div
          style={{ width }}
          className="relative z-10 aspect-video origin-center will-change-transform"
          variants={{
            hidden: { opacity: 0, y: 10, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.5 },
            },
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}
