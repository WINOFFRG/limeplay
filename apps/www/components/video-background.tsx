"use client"

import Image from "next/image"
import background from "@/public/bg-7.jpg"
import { motion } from "motion/react"

import styles from "./video-background.module.css"

export function VideoBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        ${styles.containerBackground}
        pointer-events-none absolute inset-0 select-none
      `}
    >
      <Image
        fill
        suppressHydrationWarning
        alt="Video Background"
        src={background}
        // src={`https://qusmdshfvwgcppaiykvd.supabase.co/storage/v1/object/public/chr-v3-prd-user-image-uploads/intro-cover/curated/gradient${parsedNumber}.jpg`}
        className="size-full object-cover"
      />
      {/* </BlurFade> */}
      <div className="absolute inset-0 opacity-50 backdrop-blur-sm" />
      <div
        className={`
          absolute inset-[0_auto_0_0] w-2/6 bg-gradient-to-r from-black to-transparent opacity-50
        `}
      />
      <div
        className={`
          absolute inset-[0_0_0_auto] w-1/4 bg-gradient-to-l from-black to-transparent opacity-50
        `}
      />
    </motion.div>
  )
}
