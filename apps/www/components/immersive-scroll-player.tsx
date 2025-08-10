"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const { width: vw, height: vh } = useViewportSize()

  const [initialWidthPx, midWidthPx, finalWidthPx] = useMemo(() => {
    const fitByHeight = Math.round((vh * 16) / 9)
    const fitWidth = Math.min(vw, fitByHeight) // contain: fit within viewport bounds
    const initial = Math.min(960, Math.max(320, Math.round(fitWidth * 0.6)))
    const mid = Math.min(1200, Math.round(fitWidth * 0.96))
    const final = fitWidth
    return [initial, mid, final]
  }, [vw, vh])

  const width = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [initialWidthPx, midWidthPx, finalWidthPx]
  )

  // Staggered appear animation on mount
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, when: "beforeChildren" },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[300vh]"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="sticky top-0 grid h-svh w-full place-items-center overflow-hidden">
        <motion.div
          style={{ width }}
          className="aspect-video origin-center will-change-auto"
          variants={childVariants}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}
