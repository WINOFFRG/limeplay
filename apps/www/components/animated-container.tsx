"use client"

import type { ComponentProps, ReactNode } from "react"

import { motion, useReducedMotion } from "motion/react"

type ViewAnimationProps = {
  children: ReactNode
  className?: ComponentProps<typeof motion.div>["className"]
  delay?: number
}

export function AnimatedContainer({
  children,
  className,
  delay = 0.1,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return children
  }

  return (
    <motion.div
      className={className}
      initial={{ filter: "blur(4px)", opacity: 0, translateY: -8 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      whileInView={{ filter: "blur(0px)", opacity: 1, translateY: 0 }}
    >
      {children}
    </motion.div>
  )
}
