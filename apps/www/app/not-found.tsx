"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { ArrowLeft } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"
import { Button } from "@/components/ui/button"
import { AGENT_RECOVERY_LINKS } from "@/lib/agent-content"

export default function NotFound() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatedGradientBackground
        Breathing={true}
        gradientColors={[
          "#0A0A0A",
          "#2979FF",
          "#FF80AB",
          "#FF6D00",
          "#FFD600",
          "#00E676",
          "#3D5AFE",
        ]}
      />
      <div className="relative z-10 mt-32 flex h-full flex-col items-center justify-start px-4 text-center">
        <h1 className="text-3xl font-semibold text-white">Page not found</h1>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          <DotLottieReact
            autoplay
            className="size-80"
            loop
            src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json"
          />
        </motion.div>
        <motion.p
          animate={{ opacity: 1 }}
          className={`
            mt-4 max-w-lg text-lg text-gray-300
            md:text-xl
          `}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.nav
          animate={{ opacity: 1 }}
          aria-label="404 recovery links"
          className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-300"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {AGENT_RECOVERY_LINKS.map((link) => (
            <Link
              className="
                underline underline-offset-4
                hover:text-white
              "
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Button asChild className="mt-8" variant="outline">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Go Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
