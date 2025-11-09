"use client";

import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import { useCopyToClipboard } from "react-use";





const command = "npx shadcn add @limeplay/linear-player"

export default function HeroButtons() {
  const [isCopied, copyToClipboard] = useCopyToClipboard()

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        sm:gap-3
        md:flex-row md:gap-2
      `}
    >
      <motion.div
        onClick={() => {
          copyToClipboard(command)
        }}
        initial={{ padding: "0px 20px" }}
        whileHover={{ padding: "0px 32px" }}
        whileTap={{ padding: "0px 20px" }}
        transition={{
          duration: 1,
          bounce: 0.6,
          type: "spring",
        }}
        className={`
          group relative flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-neutral-800/20 font-mono text-slate-700
          backdrop-blur-lg
          sm:h-11
          md:h-12
        `}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
        <div
          className={`
            flex items-center gap-px text-xs
            group-active:scale-[0.999]
            sm:text-sm
          `}
        >
          <span>{command.split("/")[0]}/</span>
          <span className="flex items-center gap-2 opacity-40">
            {command.split("/")[1]}
            <motion.span
              aria-label="Copy to clipboard"
              aria-hidden="true"
              key={isCopied.value ? "check" : "copy"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                bounce: 0.3,
              }}
              className={`
                hidden
                lg:block
              `}
            >
              {isCopied.value ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.span>
          </span>
        </div>
      </motion.div>
      <Link href="/docs/quick-start">
        <motion.div
          initial={{ padding: "0px 20px" }}
          whileHover={{ padding: "0px 32px" }}
          whileTap={{ padding: "0px 20px" }}
          transition={{
            duration: 1,
            bounce: 0.6,
            type: "spring",
          }}
          className={`
            hidden h-12 w-fit cursor-pointer items-center justify-center rounded-xl bg-neutral-600 text-sm font-medium
            hover:bg-neutral-700
            md:flex
          `}
        >
          Quick Start
        </motion.div>
      </Link>
    </div>
  )
}
