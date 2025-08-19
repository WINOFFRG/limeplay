import eslint from "@eslint/js"
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

export const defineConfig = tseslint.config

export const baseConfig = [
  {
    ignores: [
      "**/eslint.config.*",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/__index__.tsx",
      "**/.source/**",
      "**/prettier.config.cjs",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      turbo: turboPlugin,
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      ...turboPlugin.configs.recommended.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
    },
  },
]

export default tseslint.config(baseConfig)
