"use client"

import React, { useCallback, useRef, useState } from "react"
import { Copy } from "lucide-react"
import type { Variants } from "motion/react"
import { motion } from "motion/react"
import { useCopyToClipboard } from "react-use"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  className?: string
  onCopy?: () => Promise<void> | void
  containerRef?: React.RefObject<HTMLElement>
}

const copyIconVariants: Variants = {
  idle: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copying: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copied: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

const checkIconVariants: Variants = {
  idle: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copying: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copied: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

const checkPathVariants: Variants = {
  idle: {
    pathLength: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copying: {
    pathLength: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copied: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

const MotionButton = motion.create(Button)

export const CopyButton: React.FC<CopyButtonProps> = ({
  onCopy,
  className,
  containerRef,
}) => {
  const [status, setStatus] = useState<"idle" | "copying" | "copied">("idle")
  const [backgroundState, setBackgroundState] = useState<
    "hidden" | "entering" | "centered" | "leaving"
  >("hidden")
  const [entryDirection, setEntryDirection] = useState({ x: 0, y: 0 })
  const [leaveDirection, setLeaveDirection] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [, copyToClipboard] = useCopyToClipboard()

  const handleCopy = async () => {
    if (status !== "idle") return

    setStatus("copying")
    try {
      if (onCopy) {
        await onCopy()
      } else if (containerRef?.current) {
        const textContent =
          containerRef.current.textContent || "No text content"
        copyToClipboard(textContent)
      }
      setTimeout(() => {
        setStatus("copied")
      }, 100)

      setTimeout(() => {
        setStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Copy error:", error)
      setStatus("idle")
    }
  }

  const calculateDirection = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return { x: 0, y: 0 }

      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX
      const mouseY = e.clientY

      const offsetX = mouseX - centerX
      const offsetY = mouseY - centerY

      return { x: offsetX, y: offsetY }
    },
    []
  )

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const direction = calculateDirection(e)
      setEntryDirection(direction)
      setBackgroundState("entering")
      setTimeout(() => {
        setBackgroundState("centered")
      }, 10)
    },
    [calculateDirection]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const direction = calculateDirection(e)
      setLeaveDirection(direction)
      setBackgroundState("leaving")
      setTimeout(() => {
        setBackgroundState("hidden")
      }, 150)
    },
    [calculateDirection]
  )

  const getBackgroundAnimation = useCallback(() => {
    switch (backgroundState) {
      case "hidden":
        return {
          opacity: 0,
          x: entryDirection.x,
          y: entryDirection.y,
          scale: 0.6,
          transition: { duration: 0 },
        }
      case "entering":
        return {
          opacity: 0,
          x: entryDirection.x,
          y: entryDirection.y,
          scale: 0.6,
          transition: { duration: 0 },
        }
      case "centered":
        return {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration: 0.15 },
        }
      case "leaving":
        return {
          opacity: 0,
          x: leaveDirection.x,
          y: leaveDirection.y,
          scale: 1,
          transition: { duration: 0.15 },
        }
      default:
        return {
          opacity: 0,
          x: 0,
          y: 0,
          scale: 0.6,
          transition: { duration: 0 },
        }
    }
  }, [backgroundState, entryDirection, leaveDirection])

  return (
    <div className="relative z-10 mb-1 ml-1">
      <motion.div
        className="absolute inset-0 -z-1 rounded-md bg-muted"
        animate={getBackgroundAnimation()}
      />
      <MotionButton
        ref={buttonRef}
        onClick={handleCopy}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        variant="ghost"
        size="icon"
        className={cn(
          `
            relative size-8 cursor-pointer bg-none text-muted-foreground transition duration-300 ease-out
            hover:scale-105 hover:bg-transparent hover:text-white
          `,
          className
        )}
        aria-label="Copy code"
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        disabled={status !== "idle"}
      >
        <div className="relative size-4">
          {/* Copy Icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={status}
            variants={copyIconVariants}
          >
            <Copy className="size-4" />
          </motion.div>

          {/* Check Icon */}
          <motion.div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              status !== "copied" && "hidden"
            )}
            animate={status}
            variants={checkIconVariants}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M4 12 9 17L20 6"
                animate={status}
                variants={checkPathVariants}
              />
            </svg>
          </motion.div>
        </div>
      </MotionButton>
    </div>
  )
}
