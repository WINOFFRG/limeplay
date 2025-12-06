"use client"

import type {
  TargetAndTransition,
  Transition,
  Variant,
  Variants,
} from "motion/react"

import { AnimatePresence, motion } from "motion/react"
import React from "react"

import { cn } from "@/lib/utils"

export type PerType = "char" | "line" | "word"

export type PresetType = "blur" | "fade" | "fade-in-blur" | "scale" | "slide"

export type TextEffectProps = {
  as?: keyof React.JSX.IntrinsicElements
  children: string
  className?: string
  containerTransition?: Transition
  delay?: number
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  per?: PerType
  preset?: PresetType
  segmentTransition?: Transition
  segmentWrapperClassName?: string
  speedReveal?: number
  speedSegment?: number
  style?: React.CSSProperties
  trigger?: boolean
  variants?: {
    container?: Variants
    item?: Variants
  }
}

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  line: 0.1,
  word: 0.05,
}

const defaultContainerVariants: Variants = {
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0 },
      hidden: { filter: "blur(12px)", opacity: 0 },
      visible: { filter: "blur(0px)", opacity: 1 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0 },
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  "fade-in-blur": {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0, y: 20 },
      hidden: { filter: "blur(12px)", opacity: 0, y: 20 },
      visible: { filter: "blur(0px)", opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, scale: 0 },
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, y: 20 },
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
}

const AnimationComponent: React.FC<{
  per: "char" | "line" | "word"
  segment: string
  segmentWrapperClassName?: string
  variants: Variants
}> = React.memo(({ per, segment, segmentWrapperClassName, variants }) => {
  const content =
    per === "line" ? (
      <motion.span className="block" variants={variants}>
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span
        aria-hidden="true"
        className="inline-block whitespace-pre"
        variants={variants}
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split("").map((char, charIndex) => (
          <motion.span
            aria-hidden="true"
            className="inline-block whitespace-pre"
            key={`char-${charIndex}`}
            variants={variants}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    )

  if (!segmentWrapperClassName) {
    return content
  }

  const defaultWrapperClassName = per === "line" ? "block" : "inline-block"

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  )
})

AnimationComponent.displayName = "AnimationComponent"

const splitText = (text: string, per: PerType) => {
  if (per === "line") return text.split("\n")
  return text.split(/(\s+)/)
}

const hasTransition = (
  variant?: Variant
): variant is TargetAndTransition & { transition?: Transition } => {
  if (!variant) return false
  return typeof variant === "object" && "transition" in variant
}

const createVariantsWithTransition = (
  baseVariants: Variants,
  transition?: Transition & { exit?: Transition }
): Variants => {
  if (!transition) return baseVariants

  const { exit: _, ...mainTransition } = transition

  return {
    ...baseVariants,
    exit: {
      ...baseVariants.exit,
      transition: {
        ...(hasTransition(baseVariants.exit)
          ? baseVariants.exit.transition
          : {}),
        ...mainTransition,
        staggerDirection: -1,
      },
    },
    visible: {
      ...baseVariants.visible,
      transition: {
        ...(hasTransition(baseVariants.visible)
          ? baseVariants.visible.transition
          : {}),
        ...mainTransition,
      },
    },
  }
}

export function TextEffect({
  as = "p",
  children,
  className,
  containerTransition,
  delay = 0,
  onAnimationComplete,
  onAnimationStart,
  per = "word",
  preset = "fade",
  segmentTransition,
  segmentWrapperClassName,
  speedReveal = 1,
  speedSegment = 1,
  style,
  trigger = true,
  variants,
}: TextEffectProps) {
  const segments = splitText(children, per)
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  const baseVariants = presetVariants[preset]

  const stagger = defaultStaggerTimes[per] / speedReveal

  const baseDuration = 0.3 / speedSegment

  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.staggerChildren
    : undefined

  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.delayChildren
    : undefined

  const computedVariants = {
    container: createVariantsWithTransition(
      variants?.container || baseVariants.container,
      {
        delayChildren: customDelay ?? delay,
        staggerChildren: customStagger ?? stagger,
        ...containerTransition,
        exit: {
          staggerChildren: customStagger ?? stagger,
          staggerDirection: -1,
        },
      }
    ),
    item: createVariantsWithTransition(variants?.item || baseVariants.item, {
      duration: baseDuration,
      ...segmentTransition,
    }),
  }

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          animate="visible"
          className={className}
          exit="exit"
          initial="hidden"
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
          variants={computedVariants.container}
        >
          {per !== "line" ? <span className="sr-only">{children}</span> : null}
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              per={per}
              segment={segment}
              segmentWrapperClassName={segmentWrapperClassName}
              variants={computedVariants.item}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  )
}
