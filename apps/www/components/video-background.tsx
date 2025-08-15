"use client"

import Image from "next/image"
import ShadowOverlay28 from "@/public/shadow-overlays-028.png"
import { motion, useScroll, useTransform } from "motion/react"

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
      style={{ opacity, scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="pointer-events-none fixed inset-0 z-0 transform-gpu overflow-hidden will-change-transform select-none"
    >
      <div
        className={`absolute inset-0 bg-[url('/noise2.svg')] bg-size-[180px] bg-repeat opacity-[0.12] mix-blend-overlay`}
      />
      <motion.div
        className="absolute inset-0 z-10 transform-gpu will-change-transform"
        initial={{ opacity: 0, x: -60, scale: 1.1 }}
        animate={{ opacity: 0.4, x: 0, scale: 1 }}
        transition={{
          duration: 2.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3,
        }}
      >
        <Image
          src={ShadowOverlay28}
          alt="Tree shadow"
          className="size-full sm:scale-120 opacity-50 mix-blend-multiply blur-xs object-cover sm:object-fill"
          style={{
            transform: "translate3d(-8%, -3%, 0)",
          }}
          priority
          quality={75}
        />
      </motion.div>
    </motion.div>
  )
}
