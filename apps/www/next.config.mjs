import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX({})

/**
 * @type {import('next').NextConfig}
 */
const config = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",
  reactStrictMode: true,
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
    "shiki",
  ],
}

export default withMDX(config)
