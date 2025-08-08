"use client"

import Image from "next/image"
import background from "@/public/bg-7.jpg"
import { motion } from "motion/react"

export function VideoBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`pointer-events-none absolute inset-0 select-none`}
    >
      <Image
        fill
        suppressHydrationWarning
        alt="Video Background"
        src={background}
        className="size-full object-cover"
      />
      {/* </BlurFade> */}
      <div className="absolute inset-0 opacity-50 backdrop-blur-sm" />
      <div
        className={`absolute inset-[0_auto_0_0] w-2/6 bg-gradient-to-r from-black to-transparent opacity-50`}
      />
      <div
        className={`absolute inset-[0_0_0_auto] w-1/4 bg-gradient-to-l from-black to-transparent opacity-50`}
      />
    </motion.div>
  )
}
