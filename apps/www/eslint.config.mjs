import path from "node:path"
import { fileURLToPath } from "node:url"

import nextPlugin from "@next/eslint-plugin-next"
import { plugin as shadcn } from "@shadcn/lint"
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"
import tseslint from "typescript-eslint"

import { baseConfig } from "../../eslint.config.mjs"

const appDir = path.dirname(fileURLToPath(import.meta.url))

// Non-Tailwind marker classes used for styling hooks and prose opt-outs.
const markerClasses = ["limeplay", "dark", "shiki", "not-prose", "light"]

const eslintConfig = [
  {
    files: ["**/*"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "better-tailwindcss": pluginBetterTailwindcss,
    },
    rules: {
      ...pluginBetterTailwindcss.configs["recommended-warn"].rules,
      ...pluginBetterTailwindcss.configs["recommended-error"].rules,
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "error",
        { printWidth: 150 },
      ],
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: markerClasses },
      ],
    },
    settings: {
      "better-tailwindcss": {
        cwd: appDir,
        entryPoint: "app/eslint.css",
        detectComponentClasses: true,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      shadcn,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Fumadocs tokens and classes live in app/docs/docs.css, which is not
      // part of the components.json theme (app/global.css) that @shadcn/lint reads.
      "shadcn/no-raw-colors": ["error", { allow: ["*-fd-*"] }],
      "shadcn/no-unknown-classes": [
        "error",
        {
          allow: [...markerClasses, "animate-fd-*", "fd-scroll-container"],
        },
      ],
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },
  {
    // Brand-logo fills, SVG clip paths, and the light/dark toggle glyph use literal colors on purpose.
    files: [
      "components/icons.tsx",
      "components/theme-toggle.tsx",
      "components/copy-button.tsx",
    ],
    rules: { "shadcn/no-raw-colors": "off" },
  },
  {
    // Registry block accent colors with no matching theme token. They are
    // exempted here rather than with eslint-disable comments, because those
    // comments ship to registry users who may not have @shadcn/lint installed.
    files: [
      "registry/default/blocks/audio-player/components/fixed-timeline-control.tsx",
      "registry/default/blocks/video-player/components/timeline-slider-control.tsx",
    ],
    rules: {
      "shadcn/no-raw-colors": [
        "error",
        {
          allow: [
            "*-fd-*",
            "bg-red-600",
            "bg-rose-600",
            "from-rose-600",
            "to-pink-500",
          ],
        },
      ],
    },
  },
  ...baseConfig,
]

export default tseslint.config(eslintConfig)
