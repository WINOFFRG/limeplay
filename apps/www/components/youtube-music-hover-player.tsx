"use client"

import { LinkIcon, SquareArrowOutUpRightIcon } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

import { YouTubeMusicPlayer } from "@/registry/pro/blocks/youtube-music/components/media-player"

import { Button } from "./ui/button"

export function YouTubeMusicHoverPlayer() {
  return (
    <motion.div
      animate="closed"
      className="isolate"
      initial="closed"
      whileHover="open"
    >
      <motion.div
        className={`mx-auto block max-w-5xl`}
        style={{ transformOrigin: "bottom left" }}
        transition={{
          damping: 28,
          mass: 0.72,
          stiffness: 380,
          type: "spring",
        }}
        variants={{
          closed: { opacity: 0.98, scale: 0.985, y: 48 },
          open: { opacity: 1, scale: 1, y: 0 },
        }}
      >
        <div className="flex h-15 w-fit flex-row items-center gap-4 rounded-t-2xl bg-black px-8">
          <div className="flex w-full items-center justify-center gap-1">
            <svg
              height="36px"
              viewBox="0 0 48 48"
              width="36px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" fill="#f44336" r="20" />
              <polygon fill="#fff" points="21,29 29,24 21,19" />
              <path
                d="M24,14c5.5,0,10,4.476,10,10s-4.476,10-10,10S14,29.5,14,24S18.5,14,24,14"
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
              />
            </svg>
            <span className="text-3xl font-semibold tracking-tight text-white">
              Music
            </span>
          </div>
          <div className="my-auto h-8 w-0.5 rounded-md bg-muted-foreground"></div>
          <Button asChild size="xs">
            <Link className="text-sm font-semibold tracking-tight" href="#">
              Install Now
              <SquareArrowOutUpRightIcon className="ml-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
      <YouTubeMusicPlayer />
    </motion.div>
  )
}
