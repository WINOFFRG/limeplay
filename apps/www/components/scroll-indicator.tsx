"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useState } from "react"

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
      className={`
        pointer-events-none fixed bottom-8 left-1/2 z-20 hidden -translate-x-1/2 transform
        md:block
      `}
      style={{ opacity, y }}
    >
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 2.3, duration: 0.8 }}
        >
          <div className="relative h-10 w-6 rounded-full border-2 border-slate-400/60">
            <motion.div
              animate={{
                opacity: [0.4, 1, 0.4],
                y: [0, 12, 0],
              }}
              className="absolute top-2 left-1/2 h-3 w-1 -translate-x-1/2 transform rounded-full bg-slate-500/80"
              transition={{
                delay: 3,
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
