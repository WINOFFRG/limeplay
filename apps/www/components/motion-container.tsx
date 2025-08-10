"use client"

import { motion } from "motion/react"

export function MotionContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        transform: "translate(-50%, -49%) scale(0.95)",
        scale: 0,
      }}
      animate={{
        opacity: 1,
        transform: "translate(-50%, -50%)",
        scale: 1,
      }}
      transition={{
        scale: {
          type: "spring",
          visualDuration: 0.9,
          stiffness: 100,
        },
        opacity: {
          type: "spring",
          duration: 0.4,
        },
      }}
      className={`absolute top-1/2 left-1/2 w-dvh`}
    >
      {children}
    </motion.div>
  )
}
