import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX({});

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
    "shiki",
  ],
};

export default withMDX(config);
