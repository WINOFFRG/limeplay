"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"

export function VideoBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress for fade-out effect
  const { scrollYProgress } = useScroll()

  // Fade out background synchronized with player expansion
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 0.7, 0.2, 0]
  )

  // Scale effect for parallax depth
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: "url('https://assets.shots.so/canvas/noise2.svg')",
          backgroundSize: "180px 180px",
          backgroundRepeat: "repeat",
        }}
      />

      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0, x: -60, scale: 1.1 }}
        animate={{ opacity: 0.4, x: 0, scale: 1 }}
        transition={{
          duration: 2.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3,
        }}
      >
        <div className="relative h-full w-full">
          <Image
            src="https://shots.so/display-assets/shadow-overlays/087.png"
            alt="Tree shadow"
            fill
            className="opacity-65 mix-blend-multiply"
            style={{
              transform: "scale(1.2) translate3d(-8%, -3%, 0)",
              filter: "blur(0.8px)",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-20"
        initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
        transition={{
          duration: 3.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.8,
        }}
      >
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 opacity-25 mix-blend-multiply"
            style={{
              background: `
                radial-gradient(ellipse 280px 180px at 25% 35%, rgba(0,0,0,0.3) 0%, transparent 50%),
                radial-gradient(ellipse 220px 140px at 75% 55%, rgba(0,0,0,0.25) 0%, transparent 50%),
                radial-gradient(ellipse 180px 260px at 55% 25%, rgba(0,0,0,0.15) 0%, transparent 50%)
              `,
              filter: "blur(1.5px)",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 2,
          ease: "easeOut",
          delay: 1.3,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(48deg, rgba(255,248,220,0.08) 0%, transparent 65%)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 4,
          ease: "easeOut",
          delay: 1.8,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}
