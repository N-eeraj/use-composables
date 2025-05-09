import { defineConfig } from "vite"
import path from "path"
import fs from "fs"

const srcPath = path.resolve(__dirname, "src")

const inputEntries = fs.readdirSync(srcPath)
  .filter(file => file.endsWith(".ts"))
  .reduce((entries, file) => {
    const name = path.basename(file, ".ts")
    entries[name] = path.resolve(srcPath, file)
    return entries
  }, {} as Record<string, string>)

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: inputEntries,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        chunkFileNames: "shared/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
})
