/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: [],
  },

  transpilePackages: ["@limeplay/core"],

  async rewrites() {
    const isVercel = !!process.env.VERCEL_ENV
    if (isVercel) {
      return {
        beforeFiles: [
          {
            source: "/:path*.map",
            destination: "/404",
          },
        ],
      }
    }

    return []
  },
}

module.exports = nextConfig
