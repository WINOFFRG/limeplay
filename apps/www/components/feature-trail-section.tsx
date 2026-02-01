"use client"

import type { Icon } from "@phosphor-icons/react"

import {
  ArrowsInIcon,
  ArrowsOutIcon,
  BroadcastIcon,
  ClosedCaptioningIcon,
  FastForwardIcon,
  FourKIcon,
  GearIcon,
  ListIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  RepeatIcon,
  RepeatOnceIcon,
  RewindIcon,
  ShuffleIcon,
  SkipForwardIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react/dist/ssr"
import {
  motion,
  type MotionValue,
  useScroll,
  useTime,
  useTransform,
} from "motion/react"
import { useRef } from "react"

const BOUNCE_AMPLITUDE = 30
const BOUNCE_SPEED = 0.001
const SCROLL_TRANSLATE_RANGE = 200

const CIRCLES = [
  { icon: PlayIcon, id: "circle-1" },
  { icon: PauseIcon, id: "circle-2" },
  { icon: SpeakerHighIcon, id: "circle-3" },
  { icon: SpeakerSlashIcon, id: "circle-4" },
  { icon: FastForwardIcon, id: "circle-5" },
  { icon: RewindIcon, id: "circle-6" },
  { icon: SkipForwardIcon, id: "circle-7" },
  { icon: FourKIcon, id: "circle-8" },
  { icon: ShuffleIcon, id: "circle-9" },
  { icon: RepeatIcon, id: "circle-10" },
  { icon: RepeatOnceIcon, id: "circle-11" },
  { icon: PictureInPictureIcon, id: "circle-12" },
  { icon: ArrowsOutIcon, id: "circle-13" },
  { icon: ArrowsInIcon, id: "circle-14" },
  { icon: ClosedCaptioningIcon, id: "circle-15" },
  { icon: BroadcastIcon, id: "circle-16" },
  { icon: GearIcon, id: "circle-17" },
  { icon: ListIcon, id: "circle-18" },
]

interface BouncingCircleProps {
  icon: Icon
  index: number
  time: MotionValue<number>
}

export function FeatureTrailSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const time = useTime()

  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: containerRef,
  })

  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [SCROLL_TRANSLATE_RANGE, -SCROLL_TRANSLATE_RANGE]
  )

  return (
    <section
      className={`
        relative z-10 overflow-x-clip py-24
        md:py-32
        lg:py-40
      `}
      ref={containerRef}
    >
      <motion.ul
        className={`
          mx-auto flex flex-nowrap items-center justify-center gap-2 px-4
          md:gap-3
        `}
        style={{ x: translateX }}
      >
        {CIRCLES.map((circle, index) => (
          <BouncingCircle
            icon={circle.icon}
            index={index}
            key={circle.id}
            time={time}
          />
        ))}
      </motion.ul>
      <div
        className={`
          mx-auto mt-16 max-w-5xl px-page
          md:mt-24
        `}
      >
        <div className="text-center">
          <h2
            className={`
              text-3xl font-medium tracking-tight text-foreground
              md:text-4xl
              lg:text-5xl
            `}
          >
            Packed with Batteries
          </h2>
        </div>
      </div>
    </section>
  )
}

function BouncingCircle({ icon: Icon, index, time }: BouncingCircleProps) {
  const phaseOffset = (index / CIRCLES.length) * Math.PI * 2
  const yOffset = useTransform(time, (t) => {
    return Math.sin(t * BOUNCE_SPEED + phaseOffset) * BOUNCE_AMPLITUDE
  })

  return (
    <motion.li
      className="list-none"
      style={{
        y: yOffset,
      }}
    >
      <div
        className={`
          relative flex aspect-square h-[70px] w-[70px] items-center justify-center rounded-full border border-zinc-900/10 bg-gray-50 text-[26px]
          font-light will-change-transform backface-hidden
          lg:h-[98px] lg:w-[98px] lg:text-[36px]
        `}
      >
        <Icon weight="regular" />
      </div>
    </motion.li>
  )
}
