import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"

import baseConfig, { compat, defineConfig } from "../../eslint.config.mjs"

const tailwindConfig = {
  files: ["**/*.{jsx,tsx}"],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    "better-tailwindcss": eslintPluginBetterTailwindcss,
  },
  rules: {
    ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
    ...eslintPluginBetterTailwindcss.configs["recommended-error"].rules,
    "better-tailwindcss/enforce-consistent-line-wrapping": [
      "warn",
      { printWidth: 150 },
    ],
    "better-tailwindcss/no-unregistered-classes": {
      ignore: ["dark"],
    },
  },
}

const eslintConfig = [
  {
    ...tailwindConfig,
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/global.css",
        tailwindConfig: "tailwind.config.js",
        detectComponentClasses: true,
      },
    },
  },
  ...compat.config({
    extends: [
      "next",
      "plugin:@next/next/recommended",
      "next/core-web-vitals",
      "next/typescript",
    ],
    settings: {
      next: {
        rootDir: "app",
      },
    },
  }),
  ...baseConfig,
]

export default defineConfig(...eslintConfig)
