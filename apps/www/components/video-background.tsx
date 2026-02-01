"use client"

import { motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"

import ShadowOverlay28 from "@/public/shadow-overlays-087.png"

export function VideoBackground() {
  const { scrollYProgress } = useScroll()

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 0.7, 0.2, 0]
  )

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="pointer-events-none fixed inset-0 z-0 transform-gpu overflow-hidden select-none"
      initial={{ opacity: 0 }}
      style={{ opacity, scale }}
      transition={{
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        className={`absolute inset-0 bg-[url('/noise2.svg')] bg-size-[180px] bg-repeat opacity-[0.12] mix-blend-overlay`}
      />
      <motion.div
        animate={{ opacity: 0.4, scale: 1, x: 0 }}
        className="absolute inset-0 z-10 transform-gpu will-change-transform"
        initial={{ opacity: 0, scale: 1.1, x: -60 }}
        transition={{
          delay: 0.3,
          duration: 2.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Image
          alt="shadow page background"
          className={`
            size-full object-cover opacity-25 mix-blend-multiply
            sm:translate-x-[-5%] sm:translate-y-[-3%] sm:translate-3d sm:scale-120 sm:object-fill
          `}
          priority
          quality={75}
          src={ShadowOverlay28}
        />
      </motion.div>
    </motion.div>
  )
}
