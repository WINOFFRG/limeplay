import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX({})

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ]
  },
}

export default withMDX(config)
