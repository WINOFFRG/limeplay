import path from "path"
import { fileURLToPath } from "url"
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import eslintParserTypeScript from "@typescript-eslint/parser"
import prettierConfig from "eslint-config-prettier"
import turboPlugin from "eslint-plugin-turbo"
import globals from "globals"
import tseslint from "typescript-eslint"

export const defineConfig = tseslint.config

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
})

export const base = defineConfig(
  {
    ignores: [
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/__index__.tsx",
      "**/.source/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  comments.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
  },

  {
    files: ["**/*.{ts,tsx,cts,mts,mjs}"],
    languageOptions: {
      parser: eslintParserTypeScript,
      parserOptions: {
        project: true,
      },
    },
  },

  prettierConfig,

  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...turboPlugin.configs.recommended.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
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
  }
)

export default defineConfig(...base)
