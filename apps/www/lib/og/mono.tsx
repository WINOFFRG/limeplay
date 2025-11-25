import fs from "node:fs/promises";
import type { ImageResponseOptions } from "next/server";
import type { ReactNode } from "react";

export type GenerateProps = {
  title: ReactNode;
  description?: ReactNode;
  site?: ReactNode;
  logo?: ReactNode;
};

const font = fs.readFile("./lib/og/JetBrainsMono-Regular.ttf");
const fontBold = fs.readFile("./lib/og/JetBrainsMono-Bold.ttf");

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Mono",
        data: await font,
        weight: 400,
      },
      {
        name: "Mono",
        data: await fontBold,
        weight: 600,
      },
    ],
  };
}

export function generate({
  title,
  description,
  site = "Limeplay",
}: GenerateProps) {
  const foreground = "rgb(244,244,244)";
  const muted = "rgba(244,244,244,0.72)";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "64px",
        color: foreground,
        backgroundColor: "black",
        border: "1px solid rgba(255,255,255,0.04)",
        fontFamily: '"Mono", "JetBrains Mono", monospace',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 32,
          borderRadius: "32px",
          border: "1px solid rgba(255,255,255,0.05)",
          background:
            "linear-gradient(130deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "32px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "28px",
            color: muted,
          }}
        >
          <span
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.4)",
              fontSize: "24px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: foreground,
            }}
          >
            {site}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "60px",
              margin: "0",
              padding: "0",
            }}
          >
            {title}
          </p>
          {description ? (
            <p
              style={{
                padding: "0",
                fontSize: "38px",
                margin: "0",
                color: muted,
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
