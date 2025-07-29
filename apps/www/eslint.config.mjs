import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"

import baseConfig, { compat, defineConfig } from "../../eslint.config.mjs"

const eslintConfig = [
  ...baseConfig,
  {
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
        { printWidth: 100 },
      ],
    },
    settings: {
      "better-tailwindcss": {
        // tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
        entryPoint: "app/global.css",
        // tailwindcss 3: the path to the tailwind config file (eg: `tailwind.config.js`)
        tailwindConfig: "tailwind.config.js",
        callees: ["classnames", "clsx", "cn", "cva"],
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
]

export default defineConfig(...eslintConfig)
