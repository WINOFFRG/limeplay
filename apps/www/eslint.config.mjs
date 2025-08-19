import nextPlugin from "@next/eslint-plugin-next"
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"
import tseslint from "typescript-eslint"

import { baseConfig } from "../../eslint.config.mjs"

const eslintConfig = [
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
      ...eslintPluginBetterTailwindcss.configs["recommended-error"].rules,
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "warn",
        { printWidth: 150 },
      ],
      "better-tailwindcss/no-unregistered-classes": [
        "error",
        { ignore: ["dark", "shiki", "not-prose"] },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/global.css",
        tailwindConfig: "tailwind.config.js",
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
  },
  ...baseConfig,
]

export default tseslint.config(eslintConfig)
