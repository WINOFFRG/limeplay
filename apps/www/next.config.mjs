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
  headers() {
    return [
      {
        source: "/docs/(.+)\\.mdx$",
        headers: [{ key: "Content-Type", value: "text/markdown" }],
      },
      {
        source: "/llms.mdx/(.*)",
        headers: [{ key: "Content-Type", value: "text/markdown" }],
      },
    ]
  },
}

export default withMDX(config)
