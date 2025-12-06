import type { ImageResponseOptions } from "next/server"
import type { ReactNode } from "react"

import fs from "node:fs/promises"

export interface GenerateProps {
  description?: ReactNode
  logo?: ReactNode
  site?: ReactNode
  title: ReactNode
}

const font = fs.readFile("./lib/og/JetBrainsMono-Regular.ttf")
const fontBold = fs.readFile("./lib/og/JetBrainsMono-Bold.ttf")

export function generate({
  description,
  site = "Limeplay",
  title,
}: GenerateProps) {
  const foreground = "rgb(244,244,244)"
  const muted = "rgba(244,244,244,0.72)"

  return (
    <div
      style={{
        backgroundColor: "black",
        border: "1px solid rgba(255,255,255,0.04)",
        color: foreground,
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Mono", "JetBrains Mono", monospace',
        height: "100%",
        overflow: "hidden",
        padding: "64px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(130deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "32px",
          inset: 32,
          position: "absolute",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            alignItems: "center",
            color: muted,
            display: "flex",
            fontSize: "28px",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: "999px",
              color: foreground,
              fontSize: "24px",
              letterSpacing: "0.08em",
              padding: "8px 20px",
              textTransform: "uppercase",
            }}
          >
            {site}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontSize: "60px",
              fontWeight: 600,
              margin: "0",
              padding: "0",
            }}
          >
            {title}
          </p>
          {description ? (
            <p
              style={{
                color: muted,
                fontSize: "38px",
                margin: "0",
                padding: "0",
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    fonts: [
      {
        data: await font,
        name: "Mono",
        weight: 400,
      },
      {
        data: await fontBold,
        name: "Mono",
        weight: 600,
      },
    ],
    height: 630,
    width: 1200,
  }
}
