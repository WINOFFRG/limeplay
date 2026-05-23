import nextPlugin from "@next/eslint-plugin-next"
import pluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"
import tseslint from "typescript-eslint"

import { baseConfig } from "../../eslint.config.mjs"

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
        { ignore: ["dark", "shiki", "not-prose", "light"] },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/global.css",
        detectComponentClasses: true,
      },
      "better-tailwindcss": {
        entryPoint: "app/docs/docs.css",
        detectComponentClasses: true,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    settings: {
      next: {
        rootDir: ".",
      },
    },
  },
  ...baseConfig,
]

export default tseslint.config(eslintConfig)
