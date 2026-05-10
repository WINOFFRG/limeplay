/**
 * test-registry-install.ts
 *
 * Self-contained CI test: builds the registry, serves it via a lightweight
 * static server, scaffolds one app per framework+base combo, installs ALL
 * registry blocks into each app, generates page routes, and runs the
 * framework build. Scaffold+install is sequential (bun link conflicts),
 * builds run in parallel.
 *
 * Usage:
 *   bun run scripts/test-registry-install.ts [--skip-build]
 */

import { exec, execSync } from "child_process"
import {
  createReadStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs"
import http from "http"
import { tmpdir } from "os"
import { dirname, extname, join, resolve } from "path"

const SCRIPT_DIR = resolve(dirname(new URL(import.meta.url).pathname))
const WWW_DIR = resolve(SCRIPT_DIR, "..")
const PUBLIC_DIR = join(WWW_DIR, "public")
const EXEC_TIMEOUT = 180_000
const SERVER_PORT = 5178

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
}

interface BlockConfig {
  component: string
  importPath: string
  props?: string
  url: string
}

const BLOCK_CONFIGS: Record<string, BlockConfig> = {
  "basic-player": {
    component: "LimeplayMediaPlayer",
    importPath: "components/basic-player/components/media-player",
    props: `src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"`,
    url: "/r/basic-player.json",
  },
  "linear-player": {
    component: "LinearMediaPlayer",
    importPath: "components/linear-player/components/media-player",
    url: "/r/linear-player.json",
  },
  "youtube-music": {
    component: "YouTubeMusicPlayer",
    importPath: "components/youtube-music/components/media-player",
    url: "/r/pro/youtube-music.json",
  },
}

interface BaseConfig {
  base: string
  name: string
  preset: string
}

interface FrameworkConfig {
  bases: BaseConfig[]
  buildCommand: string
  generateRoute: (
    blockName: string,
    importPath: string,
    component: string,
    props?: string
  ) => { content: string; path: string }
  name: string
  template: string
}

const FRAMEWORKS: FrameworkConfig[] = [
  {
    bases: [
      { base: "radix", name: "radix", preset: "nova" },
      { base: "base", name: "base", preset: "nova" },
    ],
    buildCommand: "npx next build",
    generateRoute: (blockName, importPath, component, props) => ({
      content: [
        `"use client"`,
        `import dynamic from "next/dynamic"`,
        `const C = dynamic(() => import("@/${importPath}").then(m => ({ default: m.${component} })), { ssr: false })`,
        `export default function Page() { return <C ${props ?? ""}/> }`,
      ].join("\n"),
      path: `app/${blockName}/page.tsx`,
    }),
    name: "nextjs",
    template: "next",
  },
  {
    bases: [
      { base: "radix", name: "radix", preset: "nova" },
      { base: "base", name: "base", preset: "nova" },
    ],
    buildCommand: "npx vite build",
    generateRoute: (blockName, importPath, component, props) => ({
      content: [
        `import { createFileRoute } from "@tanstack/react-router"`,
        `import { ${component} } from "@/${importPath}"`,
        `export const Route = createFileRoute("/${blockName}")({ component: () => <${component} ${props ?? ""}/> })`,
      ].join("\n"),
      path: `src/routes/${blockName}.tsx`,
    }),
    name: "tanstack-start",
    template: "start",
  },
]

interface PreparedApp {
  appDir: string
  base: BaseConfig
  framework: FrameworkConfig
}

interface TestResult {
  base: string
  error?: string
  framework: string
  pass: boolean
}

const tempDirs: string[] = []
let server: http.Server | null = null

function cleanup() {
  if (server) {
    server.close()
    server = null
  }
  for (const dir of tempDirs) {
    try {
      rmSync(dir, { force: true, recursive: true })
    } catch {
      // ignore
    }
  }
}

process.on("exit", cleanup)
process.on("SIGINT", () => {
  cleanup()
  process.exit(1)
})

async function buildApp(app: PreparedApp): Promise<TestResult> {
  const cellName = `${app.framework.name}/${app.base.name}`
  console.log(`  [${cellName}] Building...`)

  const result = await runAsync(app.framework.buildCommand, app.appDir)
  if (!result.ok) {
    console.log(`  [${cellName}] ✗ Build failed`)
    if (result.stderr) console.log(`    ${result.stderr.slice(0, 500)}`)
    return {
      base: app.base.name,
      error: "build failed",
      framework: app.framework.name,
      pass: false,
    }
  }

  console.log(`  [${cellName}] ✓ Passed`)
  return {
    base: app.base.name,
    framework: app.framework.name,
    pass: true,
  }
}

function buildRegistry() {
  console.log("\n📦 Building registry...")
  const result = runSync("bun run registry:build", WWW_DIR, "registry:build")
  if (!result.ok) {
    console.log("❌ Registry build failed")
    process.exit(1)
  }
  console.log("  ✓ Registry built")
}

async function main() {
  const skipBuild = process.argv.includes("--skip-build")
  const blockCount = Object.keys(BLOCK_CONFIGS).length

  console.log("🧪 Registry Install Integration Tests")
  console.log(
    `   ${FRAMEWORKS.length} frameworks × 2 bases = 4 apps, each with all ${blockCount} blocks`
  )
  console.log("   Scaffold+install: sequential | Builds: parallel")

  if (!skipBuild) {
    buildRegistry()
  }

  if (!existsSync(join(PUBLIC_DIR, "r", "registry.json"))) {
    console.log(
      "❌ public/r/registry.json not found. Run `bun run registry:build` first."
    )
    process.exit(1)
  }

  console.log("\n🌐 Starting static registry server...")
  const registryUrl = await startStaticServer()
  console.log(`  ✓ Serving public/ at ${registryUrl}`)

  // Phase 1: scaffold + install sequentially (bun link conflicts if parallel)
  console.log("\n📥 Phase 1: Scaffold & Install\n")
  const preparedApps: PreparedApp[] = []
  const earlyFailures: TestResult[] = []

  for (const framework of FRAMEWORKS) {
    for (const base of framework.bases) {
      const result = scaffoldAndInstall(registryUrl, framework, base)
      if ("pass" in result) {
        earlyFailures.push(result)
      } else {
        preparedApps.push(result)
      }
    }
  }

  // Phase 2: build in parallel
  console.log("\n🔨 Phase 2: Build (parallel)\n")
  const buildResults = await Promise.all(preparedApps.map(buildApp))

  const results = [...earlyFailures, ...buildResults]
  printSummary(results)

  const failed = results.filter((r) => !r.pass)
  process.exit(failed.length > 0 ? 1 : 0)
}

function printSummary(results: TestResult[]) {
  console.log(`\n${"═".repeat(50)}`)
  console.log("RESULTS\n")

  const maxFw = Math.max(...results.map((r) => r.framework.length))
  const maxBase = Math.max(...results.map((r) => r.base.length))

  for (const r of results) {
    const icon = r.pass ? "✅" : "❌"
    const fw = r.framework.padEnd(maxFw)
    const base = r.base.padEnd(maxBase)
    const err = r.error ? ` (${r.error})` : ""
    console.log(`  ${icon} ${fw} / ${base}${err}`)
  }

  const passed = results.filter((r) => r.pass).length
  const total = results.length
  console.log(`\n  ${passed}/${total} passed`)
}

function runAsync(
  cmd: string,
  cwd: string
): Promise<{ ok: boolean; stderr: string; stdout: string }> {
  return new Promise((resolve) => {
    exec(
      cmd,
      {
        cwd,
        env: { ...process.env, FORCE_COLOR: "0" },
        timeout: EXEC_TIMEOUT,
      },
      (error, stdout, stderr) => {
        resolve({
          ok: !error,
          stderr: stderr.toString(),
          stdout: stdout.toString(),
        })
      }
    )
  })
}

function runSync(
  cmd: string,
  cwd: string,
  label: string
): { ok: boolean; output: string } {
  try {
    const output = execSync(cmd, {
      cwd,
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: "pipe",
      timeout: EXEC_TIMEOUT,
    }).toString()
    return { ok: true, output }
  } catch (e: unknown) {
    const err = e as { stderr?: Buffer; stdout?: Buffer }
    const stderr = err.stderr?.toString() ?? ""
    const stdout = err.stdout?.toString() ?? ""
    console.log(`  ✗ ${label} failed`)
    if (stderr) console.log(`    ${stderr.slice(0, 500)}`)
    if (stdout && !stderr) console.log(`    ${stdout.slice(0, 500)}`)
    return { ok: false, output: stderr || stdout }
  }
}

function scaffoldAndInstall(
  registryUrl: string,
  framework: FrameworkConfig,
  base: BaseConfig
): PreparedApp | TestResult {
  const cellName = `${framework.name}/${base.name}`

  const tmpDir = mkdtempSync(
    join(tmpdir(), `limeplay-test-${framework.name}-${base.name}-`)
  )
  tempDirs.push(tmpDir)

  const initCmd = [
    "bunx shadcn@latest init",
    `--template ${framework.template}`,
    `--base ${base.base}`,
    `-p ${base.preset}`,
    `--name test-app`,
    "--yes",
    "--force",
  ].join(" ")

  console.log(`  [${cellName}] Scaffolding...`)
  const initResult = runSync(initCmd, tmpDir, `${cellName} scaffold`)
  if (!initResult.ok) {
    return {
      base: base.name,
      error: "scaffold failed",
      framework: framework.name,
      pass: false,
    }
  }

  const appDir = join(tmpDir, "test-app")
  const blockNames = Object.keys(BLOCK_CONFIGS)

  console.log(`  [${cellName}] Installing blocks (${blockNames.join(", ")})...`)
  for (const [blockName, blockConfig] of Object.entries(BLOCK_CONFIGS)) {
    const addCmd = [
      "bunx shadcn@latest add",
      `${registryUrl}${blockConfig.url}`,
      "--overwrite",
      "--yes",
    ].join(" ")

    const addResult = runSync(addCmd, appDir, `${cellName} add ${blockName}`)
    if (!addResult.ok) {
      return {
        base: base.name,
        error: `install ${blockName} failed`,
        framework: framework.name,
        pass: false,
      }
    }
  }

  console.log(`  [${cellName}] Generating page routes...`)
  for (const [blockName, blockConfig] of Object.entries(BLOCK_CONFIGS)) {
    const route = framework.generateRoute(
      blockName,
      blockConfig.importPath,
      blockConfig.component,
      blockConfig.props
    )
    const routePath = join(appDir, route.path)
    mkdirSync(dirname(routePath), { recursive: true })
    writeFileSync(routePath, route.content)
  }

  console.log(`  [${cellName}] Ready to build`)
  return { appDir, base, framework }
}

function startStaticServer(): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    server = http.createServer((req, res) => {
      const urlPath = req.url?.split("?")[0] ?? "/"
      const filePath = join(PUBLIC_DIR, urlPath)

      if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        res.writeHead(404)
        res.end("Not found")
        return
      }

      const ext = extname(filePath)
      const contentType = MIME_TYPES[ext] ?? "application/octet-stream"
      res.writeHead(200, { "Content-Type": contentType })
      createReadStream(filePath).pipe(res)
    })

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        reject(
          new Error(`Failed to start server. Is port ${SERVER_PORT} in use?`)
        )
      } else {
        reject(err)
      }
    })

    server.listen(SERVER_PORT, () => {
      resolvePromise(`http://localhost:${SERVER_PORT}`)
    })
  })
}

main().catch((err) => {
  console.log("❌ Fatal error:", err instanceof Error ? err.message : err)
  process.exit(1)
})
