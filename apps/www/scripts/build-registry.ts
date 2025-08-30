/* eslint-disable @typescript-eslint/no-unused-expressions */

import { exec } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import { rimraf } from "rimraf"
import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { blocks } from "@/registry/collection/registry-blocks"
import { examples } from "@/registry/collection/registry-examples"
import { hooks } from "@/registry/collection/registry-hooks"
import { internal, lib } from "@/registry/collection/registry-lib"
import { ui } from "@/registry/collection/registry-ui"

// Log level configuration
type LogLevel = "error" | "warn" | "info" | "debug"
const LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL ?? "info") as LogLevel

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const shouldLog = (level: LogLevel): boolean => {
  return logLevels[level] <= logLevels[LOG_LEVEL]
}

const logger = {
  error: (message: string) => {
    console.error(message)
  },
  warn: (message: string) => {
    shouldLog("warn") && console.warn(message)
  },
  info: (message: string) => {
    shouldLog("info") && console.log(message)
  },
  debug: (message: string) => {
    shouldLog("debug") && console.debug(message)
  },
}

const STYLE = "default"
const DEPRECATED_ITEMS = ["test"]
// Get registry host from env variable or use default
const REGISTRY_HOST = process.env.REGISTRY_HOST ?? "http://localhost:3000"
const BASE_URL = `${REGISTRY_HOST}/r/styles/default`

logger.info(`🌐 Using registry host: ${REGISTRY_HOST}`)

// Path mappings for automatic target generation
const PATH_MAPPINGS = [
  {
    pattern: "blocks/",
    targetFn: (path: string) => {
      // Extract the part after "blocks/"
      const match = /blocks\/([^/]+)\/(.+)/.exec(path)
      if (match) {
        const [, blockName, filePath] = match
        return `components/${blockName}/${filePath}`
      }
      return null
    },
  },
  // Add more mappings as needed:
  // { pattern: "hooks/", targetFn: ... },
  // { pattern: "ui/", targetFn: ... },
]

// Create a map of all registry items for quick lookup
const registryItemsMap = new Map()
;[...ui, ...lib, ...hooks, ...examples, ...blocks, ...internal].forEach(
  (item) => {
    if (item.name && !DEPRECATED_ITEMS.includes(item.name)) {
      registryItemsMap.set(item.name, item)
    }
  }
)

// Create a map of all file paths to their corresponding items
const filePathToItemMap = new Map<string, string>()
;[...ui, ...lib, ...hooks, ...examples, ...blocks, ...internal].forEach(
  (item) => {
    if (item.files) {
      item.files.forEach((file) => {
        const filePath = typeof file === "string" ? file : file.path
        filePathToItemMap.set(filePath, item.name)
      })
    }
  }
)

// Function to convert dependency string to URL if it exists in registry
function resolveRegistryDependency(dependency: string): string {
  // Skip if already a URL
  if (typeof dependency !== "string" || dependency.startsWith("http")) {
    return dependency
  }

  // Check if dependency exists in registry
  if (registryItemsMap.has(dependency)) {
    return `${BASE_URL}/${dependency}.json`
  }

  // Return original if not found
  return dependency
}

// Build the registry items
const registryItems = [
  {
    name: "index",
    type: "registry:style",
    dependencies: [
      "tw-animate-css",
      "class-variance-authority",
      "lucide-react",
    ],
    registryDependencies: ["utils"],
    cssVars: {},
    files: [],
  },
  ...ui,
  ...lib,
  ...hooks,
  ...internal,
  ...examples,
  ...blocks,
]
  .filter((item) => {
    return !DEPRECATED_ITEMS.includes(item.name)
  })
  .map((item) => {
    // Process registry dependencies
    if (item.registryDependencies?.length) {
      item.registryDependencies = item.registryDependencies.map(
        resolveRegistryDependency
      )
    }

    // Add targets for files where needed
    if (item.files) {
      item.files = item.files.map((file) => {
        // Skip string files
        if (typeof file === "string") return file

        // Skip if target already exists
        if (file.target) return file

        // Check against path mappings
        for (const mapping of PATH_MAPPINGS) {
          if (file.path.includes(mapping.pattern)) {
            const target = mapping.targetFn(file.path)
            if (target) {
              logger.info(`✅ Added target for "${file.path}" → "${target}"`)
              return { ...file, target }
            }
          }
        }

        return file
      })
    }

    return item
  })

const registry = {
  name: "winoffrg/limeplay",
  homepage: "https://limeplay.winoffrg.com",
  items: z.array(registryItemSchema).parse(registryItems),
} satisfies Registry

// Fetch and parse shadcn registry into a map keyed by name (no top-level await)
async function getShadcnRegistryMap(): Promise<Map<string, unknown>> {
  try {
    const items = await fetch(
      "https://github.com/shadcn-ui/ui/blob/main/apps/v4/public/r/index.json?raw=true"
    ).then((res) => res.json())
    return parseShadcnRegistryItemsToMap(items as Array<{ name?: string }>)
  } catch {
    return new Map<string, unknown>()
  }
}

// Convert shadcn registry array into a map keyed by item name.
// We ignore duplicates and only keep the first occurrence.
function parseShadcnRegistryItemsToMap(
  items: Array<{ name?: string }>
): Map<string, unknown> {
  const byName = new Map<string, unknown>()
  if (!Array.isArray(items)) return byName
  for (const item of items) {
    const name = typeof item.name === "string" ? item.name : undefined
    if (!name) continue
    if (!byName.has(name)) {
      byName.set(name, item)
    }
  }
  return byName
}

// Resolved on-demand via getShadcnRegistryMap()

// Check for missing and undefined dependencies
async function validateDependencies() {
  logger.info("🔍 Validating dependencies based on imports...")
  const shadcnRegistryMap = await getShadcnRegistryMap()

  // Regex to find imports from our registry
  const importRegex = /@\/registry\/default\/([^"']+)/g

  // Additional regex to catch import * as Namespace patterns
  const namespaceImportRegex =
    /import\s+\*\s+as\s+\w+\s+from\s+["']@\/registry\/default\/([^"']+)["']/g

  // Track missing registry entries
  const missingRegistryItems = new Map<string, Set<string>>()

  // Debug registry items
  logger.debug(
    "📋 Registry items: " + Array.from(registryItemsMap.keys()).join(", ")
  )

  // Check for undefined dependencies first
  for (const item of registry.items) {
    if (!item.registryDependencies?.length) continue

    const undefinedDependencies = []

    for (const dependency of item.registryDependencies) {
      // Skip URL dependencies
      if (typeof dependency !== "string" || dependency.startsWith("http")) {
        continue
      }

      // Check if dependency exists
      if (
        !registryItemsMap.has(dependency) &&
        !shadcnRegistryMap.has(dependency)
      ) {
        undefinedDependencies.push(dependency)
      }
    }

    if (undefinedDependencies.length > 0) {
      logger.error(
        `❌ Component "${item.name}" has missing dependencies in registryDependencies:`
      )
      undefinedDependencies.forEach((dep) => {
        logger.error(`   - ${dep} (not found in registry)`)
      })
      logger.error(`   These dependencies need to be defined or removed.`)
    }
  }

  // Check for missing dependencies
  for (const item of registry.items) {
    if (!item.files) continue

    const declaredDependencies = new Set(item.registryDependencies ?? [])
    logger.debug(
      `📦 Checking ${item.name} with dependencies: ${
        declaredDependencies.size
          ? Array.from(declaredDependencies).join(", ")
          : "none"
      }`
    )

    const missingDependencies = new Set<string>()

    for (const file of item.files) {
      if (typeof file === "string") continue

      try {
        const filePath = path.join(process.cwd(), "registry", STYLE, file.path)
        if (
          !(await fs
            .stat(filePath)
            .then(() => true)
            .catch(() => false))
        ) {
          logger.debug(`⚠️ File not found: ${filePath}`)
          continue
        }

        logger.debug(`🔎 Checking file: ${file.path}`)
        const content = await fs.readFile(filePath, "utf8")

        // Process both regular imports and namespace imports
        const regularImports = [...content.matchAll(importRegex)]
        const namespaceImports = [...content.matchAll(namespaceImportRegex)]

        logger.debug(
          `  - Found ${regularImports.length.toString()} regular imports, ${namespaceImports.length.toString()} namespace imports`
        )

        const allMatches = [...regularImports, ...namespaceImports]

        if (allMatches.length === 0) {
          logger.debug(`  - No registry imports found in file`)
        }

        for (const match of allMatches) {
          const importPath = match[1]
          logger.debug(`  - Found import: @/registry/default/${importPath}`)

          const importParts = importPath.split("/")

          // Skip if it's importing from itself
          if (file.path.startsWith(`${importParts[0]}/${importParts[1]}`)) {
            logger.debug(`    - Skipping self-import: ${importPath}`)
            continue
          }

          const importType = importParts[0] // ui, blocks, hooks, etc.
          const importName = importParts[1] // player-hooks, media-provider, etc.
          logger.debug(`    - Import type: ${importType}, name: ${importName}`)

          // Try to find the component by name
          if (registryItemsMap.has(importName)) {
            logger.debug(`    - Component exists: ${importName}`)
            // Component exists by name - check if it's already a dependency
            const dependencyUrl = `${BASE_URL}/${importName}.json`
            if (
              !declaredDependencies.has(importName) &&
              !declaredDependencies.has(dependencyUrl)
            ) {
              logger.debug(`    - Adding missing dependency: ${importName}`)
              missingDependencies.add(importName)
            } else {
              logger.debug(`    - Dependency already declared: ${importName}`)
            }
            continue
          } else {
            logger.debug(`    - No direct component match for: ${importName}`)

            // Track missing registry items
            if (!missingRegistryItems.has(item.name)) {
              missingRegistryItems.set(item.name, new Set())
            }
            missingRegistryItems.get(item.name)?.add(importName)
          }

          // Find the component that provides this file
          const componentPath = `${importParts[0]}/${importParts[1]}`
          const possibleFilePaths = Array.from(filePathToItemMap.keys()).filter(
            (path) => path.startsWith(componentPath)
          )

          logger.debug(
            `    - Looking for components with path: ${componentPath}`
          )
          logger.debug(
            `    - Found ${possibleFilePaths.length.toString()} possible matches`
          )

          if (possibleFilePaths.length > 0) {
            for (const filePath of possibleFilePaths) {
              const componentName = filePathToItemMap.get(filePath) ?? ""
              logger.debug(
                `      - Matched file: ${filePath} → component: ${componentName}`
              )

              // Check if this component is already in dependencies
              const dependencyUrl = `${BASE_URL}/${componentName}.json`
              if (
                componentName &&
                componentName !== item.name &&
                !declaredDependencies.has(componentName) &&
                !declaredDependencies.has(dependencyUrl)
              ) {
                logger.debug(
                  `      - Adding missing dependency: ${componentName}`
                )
                missingDependencies.add(componentName)
              } else if (componentName) {
                logger.debug(
                  `      - Dependency already declared or self-reference: ${componentName}`
                )
              }
            }
          } else {
            logger.debug(`    - No file path matches found`)
          }
        }
      } catch (error) {
        logger.error(`Error reading file ${file.path}: ${error as string}`)
      }
    }

    if (missingDependencies.size > 0) {
      logger.warn(
        `⚠️ Component "${item.name}" is missing dependencies in registryDependencies:`
      )
      missingDependencies.forEach((dep) => {
        logger.warn(`   - ${dep}`)
      })
      logger.warn(
        `   Add them to the registryDependencies array in the registry definition.`
      )

      // Force log flush by adding a slight delay
      await new Promise((resolve) => setTimeout(resolve, 10))
    } else {
      logger.debug(`✅ No missing dependencies for ${item.name}`)
    }
  }

  // Report missing registry items
  if (missingRegistryItems.size > 0) {
    logger.error(
      "\n🚫 Components are importing from registry items that don't exist:"
    )

    for (const [component, imports] of missingRegistryItems.entries()) {
      logger.error(
        `   - "${component}" imports: ${Array.from(imports).join(", ")}`
      )
    }

    logger.error(
      "   These components should be registered in the appropriate registry file (registry-ui.ts, etc.)\n"
    )

    // Force log flush by adding a slight delay
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

async function buildRegistryIndex() {
  logger.info("🗂️ Building registry/__index__.tsx...")
  let index = `/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.

import * as React from "react"

export const Index: Record<string, any> = {
  "${STYLE}": {`

  for (const item of registry.items) {
    const resolveFiles = item.files?.map(
      (file) => `registry/${STYLE}/${file.path}`
    )
    if (!resolveFiles) {
      continue
    }

    const componentPath = item.files?.[0]?.path
      ? `@/registry/${STYLE}/${item.files[0].path}`
      : ""

    index += `
    "${item.name}": {
      name: "${item.name}",
      description: "${item.description ?? ""}",
      type: "${item.type}",
      registryDependencies: ${JSON.stringify(item.registryDependencies)},
      files: [${item.files?.map((file) => {
        const filePath = `registry/${STYLE}/${
          typeof file === "string" ? file : file.path
        }`
        const resolvedFilePath = path.resolve(filePath)
        return typeof file === "string"
          ? `"${resolvedFilePath}"`
          : `{
        path: "${filePath}",
        type: "${file.type}",
        target: "${file.target ?? ""}"
      }`
      })}],
      component: ${
        componentPath
          ? `React.lazy(async () => {
        const mod = await import("${componentPath}")
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || "${item.name}"
        return { default: mod.default || mod[exportName] }
      })`
          : "null"
      },
      meta: ${JSON.stringify(item.meta)},
    },`
  }

  index += `
  }
}`

  // Create registry directory if it doesn't exist
  const registryDir = path.join(process.cwd(), "registry")
  await fs.mkdir(registryDir, { recursive: true })

  // Write style index.
  rimraf.sync(path.join(registryDir, "__index__.tsx"))
  await fs.writeFile(path.join(registryDir, "__index__.tsx"), index)
}

async function buildRegistryJsonFile() {
  logger.info("💅 Building registry.json...")
  // 1. Fix the path for registry items.
  const fixedRegistry = {
    ...registry,
    items: registry.items.map((item) => {
      const files = item.files?.map((file) => {
        return {
          ...file,
          path: `registry/${STYLE}/${file.path}`,
        }
      })

      return {
        ...item,
        files,
      }
    }),
  }

  // 2. Write the content of the registry to `registry.json`
  rimraf.sync(path.join(process.cwd(), `registry.json`))
  await fs.writeFile(
    path.join(process.cwd(), `registry.json`),
    JSON.stringify(fixedRegistry, null, 2)
  )
}

async function buildRegistry() {
  logger.info("🏗️ Building registry...")
  return new Promise((resolve, reject) => {
    const process = exec(
      `bun x shadcn build registry.json --output ../www/public/r/styles/${STYLE}`
    )

    // Capture stdout
    process.stdout?.on("data", (data) => {
      console.log(data)
    })

    // Capture stderr
    process.stderr?.on("data", (data) => {
      console.error(data)
    })

    process.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined)
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    })
  })
}

async function main() {
  try {
    logger.info("🧐 Validating dependencies...")
    await validateDependencies()
    await buildRegistryIndex()
    await buildRegistryJsonFile()
    await buildRegistry()
  } catch (error) {
    logger.error(`${error}`)
    process.exit(1)
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    logger.error(`${error}`)
    process.exit(1)
  })
