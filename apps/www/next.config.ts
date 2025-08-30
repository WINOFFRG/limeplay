import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

const config: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: process.env.VERCEL_ENV !== "production",
}

export default withMDX(config)
