export const PRODUCT_NAME = "Limeplay"
export const PRODUCT_TITLE = "React Video Player UI Components"
export const PRODUCT_DESCRIPTION =
  "Open-source React video and audio player UI components powered by Shaka Player and distributed through the shadcn CLI."
export const GITHUB_URL = "http://git.new/limeplay"
export const X_URL = "https://dub.sh/winoffrg"
export const DISCORD_URL = "https://discord.gg/ZjXFzqmqjn?utm_source=limeplay"
export const SITE_URL = "https://limeplay.winoffrg.dev"
export const PROD_BASE_HOST =
  process.env.VERCEL_ENV === "preview"
    ? `https://${process.env.VERCEL_URL ?? "limeplay.winoffrg.dev"}`
    : SITE_URL
