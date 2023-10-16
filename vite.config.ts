import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import macrosPlugin from "vite-plugin-babel-macros"

export default defineConfig({
  root: './benchmarks/src',
  plugins: [
    tsconfigPaths(),
    macrosPlugin(),
  ]
})
