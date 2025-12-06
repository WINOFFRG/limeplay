"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIsMobile } from "@/hooks/use-mobile"

interface ImmersiveScrollPlayerProps {
  children: React.ReactNode
}

export function ImmersiveScrollPlayer({
  children,
}: ImmersiveScrollPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({
    offset: ["start end", "end end"],
    target: containerRef,
  })

  const { height: vh, width: vw } = useViewportSize()

  const [initialWidthPx, _, finalWidthPx] = useMemo(() => {
    const fitByHeight = Math.round((vh * 16) / 9)
    const fitWidth = Math.min(vw, fitByHeight) // contain: fit within viewport bounds
    const initial = Math.min(1080, Math.max(320, Math.round(fitWidth * 0.6)))
    const mid = Math.min(1920, Math.round(fitWidth * 0.96))
    const final = fitWidth
    return [initial, mid, final]
  }, [vw, vh])

  const width = useTransform(
    scrollYProgress,
    [0, 0.7, 0.9, 1],
    [initialWidthPx, finalWidthPx, finalWidthPx, finalWidthPx]
  )

  const backgroundColor = useTransform(
    scrollYProgress,
    [0.5, 0.7, 0.95, 1],
    [
      "rgba(255, 255, 255, 0)",
      "rgba(0, 0, 0, 1)",
      "rgba(0, 0, 0, 1)",
      "rgba(0, 0, 0, 1)",
    ]
  )

  const borderRadius = useTransform(
    scrollYProgress,
    [0.6, 0.7, 0.9, 1],
    ["14px", "0px", "0px", "0px"]
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
      animate="show"
      className="relative h-[250vh]"
      initial="hidden"
      ref={containerRef}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08, when: "beforeChildren" },
        },
      }}
    >
      <div
        className={`sticky top-0 grid h-svh w-full snap-proximity snap-normal place-items-center overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ backgroundColor }}
        />
        <motion.div
          className="relative z-10 aspect-video origin-center overflow-hidden will-change-transform"
          style={{ borderRadius, width }}
          variants={{
            hidden: { opacity: 0, scale: 0.98, y: 10 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5 },
              y: 0,
            },
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

function useViewportSize() {
  const [size, setSize] = useState({ height: 800, width: 1200 })

  useEffect(() => {
    const update = () => {
      setSize({ height: window.innerHeight, width: window.innerWidth })
    }
    update()
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
    }
  }, [])

  return size
}
