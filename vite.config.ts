import { defineConfig } from "vite"
import path from "path"
import fs from "fs"

// Recursively find all .ts files in src/
function findAllTSFiles(dir: string, entries: Record<string, string> = {}) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = path.join(dir, file.name)

    if (file.isDirectory()) {
      findAllTSFiles(fullPath, entries)
    } else if (file.isFile() && file.name.endsWith(".ts")) {
      // Generate a key like subdir/composable2
      const relative = path.relative("src", fullPath).replace(/\.ts$/, "")
      entries[relative] = path.resolve(fullPath)
    }
  }

  return entries
}

const inputEntries = findAllTSFiles(path.resolve(__dirname, "src"))

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: inputEntries,
      external: ["vue"],
      output: {
        format: "es",
        entryFileNames: "[name].js",
      },
    },
  },
})
