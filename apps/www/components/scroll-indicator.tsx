"use client"

import { motion, useScroll, useTransform } from "motion/react"

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll()

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [1, 0.7, 0])

  const y = useTransform(scrollYProgress, [0, 0.2], [0, 50])

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none fixed bottom-8 left-1/2 z-20 -translate-x-1/2 transform"
    >
      <div className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="relative"
        >
          {/* Mouse outline */}
          <div className="relative h-10 w-6 rounded-full border-2 border-slate-400/60">
            {/* Scroll wheel dot */}
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
