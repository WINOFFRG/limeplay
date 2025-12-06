"use client"

import type { Variants } from "motion/react"

import { Copy } from "lucide-react"
import { motion } from "motion/react"
import React, { useCallback, useRef, useState } from "react"
import { useCopyToClipboard } from "react-use"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  className?: string
  containerRef?: React.RefObject<HTMLElement>
  onCopy?: () => Promise<void> | void
}

const copyIconVariants: Variants = {
  copied: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copying: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  idle: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

const checkIconVariants: Variants = {
  copied: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  copying: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  idle: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

const checkPathVariants: Variants = {
  copied: {
    opacity: 1,
    pathLength: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  copying: {
    opacity: 1,
    pathLength: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  idle: {
    opacity: 0,
    pathLength: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
}

const MotionButton = motion.create(Button)

export const CopyButton: React.FC<CopyButtonProps> = ({
  className,
  containerRef,
  onCopy,
}) => {
  const [status, setStatus] = useState<"copied" | "copying" | "idle">("idle")
  const [backgroundState, setBackgroundState] = useState<
    "centered" | "entering" | "hidden" | "leaving"
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
      case "centered":
        return {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.15 },
          x: 0,
          y: 0,
        }
      case "entering":
        return {
          opacity: 0,
          scale: 0.6,
          transition: { duration: 0 },
          x: entryDirection.x,
          y: entryDirection.y,
        }
      case "hidden":
        return {
          opacity: 0,
          scale: 0.6,
          transition: { duration: 0 },
          x: entryDirection.x,
          y: entryDirection.y,
        }
      case "leaving":
        return {
          opacity: 0,
          scale: 1,
          transition: { duration: 0.15 },
          x: leaveDirection.x,
          y: leaveDirection.y,
        }
      default:
        return {
          opacity: 0,
          scale: 0.6,
          transition: { duration: 0 },
          x: 0,
          y: 0,
        }
    }
  }, [backgroundState, entryDirection, leaveDirection])

  return (
    <div className="relative z-10 mb-1 ml-1">
      <motion.div
        animate={getBackgroundAnimation()}
        className="absolute inset-0 -z-1 rounded-md bg-muted"
      />
      <MotionButton
        aria-label="Copy code"
        className={cn(
          `
            relative size-8 cursor-pointer bg-none text-muted-foreground transition duration-300 ease-out
            hover:scale-105 hover:bg-transparent hover:text-white
          `,
          className
        )}
        disabled={status !== "idle"}
        onClick={handleCopy}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={buttonRef}
        size="icon"
        transition={{ damping: 30, stiffness: 400, type: "spring" }}
        variant="ghost"
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative size-4">
          {/* Copy Icon */}
          <motion.div
            animate={status}
            className="absolute inset-0 flex items-center justify-center"
            variants={copyIconVariants}
          >
            <Copy className="size-4" />
          </motion.div>

          {/* Check Icon */}
          <motion.div
            animate={status}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              status !== "copied" && "hidden"
            )}
            variants={checkIconVariants}
          >
            <svg
              fill="none"
              height={16}
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width={16}
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                animate={status}
                d="M4 12 9 17L20 6"
                variants={checkPathVariants}
              />
            </svg>
          </motion.div>
        </div>
      </MotionButton>
    </div>
  )
}
