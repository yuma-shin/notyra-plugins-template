import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { build } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const { parseManifest } = await import('@notyra/plugin-api/manifest')
const parsed = parseManifest(JSON.stringify(manifest))
if (!parsed.ok) throw new Error(JSON.stringify(parsed.errors, null, 2))
const shared = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  '@codemirror/state',
  '@codemirror/view',
  '@codemirror/language',
  '@codemirror/commands',
  '@lezer/highlight',
]
await build({
  root,
  configFile: false,
  build: {
    target: 'es2022',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: resolve(root, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rolldownOptions: {
      external: ['@notyra/plugin-api', ...shared],
      output: {
        paths: id =>
          id === '@notyra/plugin-api'
            ? `/${manifest.name}/@notyra/api.js`
            : `/@shared/${id.replaceAll('/', '__')}.js`,
      },
    },
  },
})
