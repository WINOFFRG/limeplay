"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"

const FADE_START = 0.1
const FADE_END = 0.3
const HIDE_THRESHOLD = 0.3

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll()

  const opacity = useTransform(
    scrollYProgress,
    [0, FADE_START, FADE_END],
    [1, 0.7, 0]
  )

  const y = useTransform(scrollYProgress, [0, 0.2], [0, 50])

  const shouldShow = useTransform(
    scrollYProgress,
    (value) => value < HIDE_THRESHOLD
  )

  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const unsubscribe = shouldShow.on("change", (latest) => {
      if (!latest) {
        setIsVisible(latest)
      }
    })

    return unsubscribe
  }, [shouldShow])

  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className={`
        pointer-events-none fixed bottom-8 left-1/2 z-20 hidden -translate-x-1/2 transform
        md:block
      `}
    >
      <div className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="relative"
        >
          <div className="relative h-10 w-6 rounded-full border-2 border-slate-400/60">
            <motion.div
              animate={{
                y: [0, 12, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
              className="absolute top-2 left-1/2 h-3 w-1 -translate-x-1/2 transform rounded-full bg-slate-500/80"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
