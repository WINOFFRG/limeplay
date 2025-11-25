export const PRODUCT_NAME = "Limeplay - Open Source Video Player UI Components";
export const PRODUCT_DESCRIPTION =
  "Modern UI Library for building video players in React, powered by Shaka Player & shadcn UI. Open source and fully customizable with themes.";
export const GITHUB_URL = "http://git.new/limeplay";
export const X_URL = "https://dub.sh/winoffrg";
export const DISCORD_URL = "https://discord.gg/ZjXFzqmqjn?utm_source=limeplay";
export const PROD_BASE_HOST =
  process.env.VERCEL_ENV === "preview"
    ? `https://${process.env.VERCEL_URL ?? "limeplay.winoffrg.dev"}`
    : "https://limeplay.winoffrg.dev";
