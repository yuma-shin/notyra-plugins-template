import { readFileSync, writeFileSync } from 'node:fs'
import { parseManifest } from '@notyra/plugin-api/manifest'
const [id, displayName = id] = process.argv.slice(2)
if (!id) throw new Error('Usage: pnpm rename my-plugin "My Plugin"')
const url = new URL('../package.json', import.meta.url)
const pkg = JSON.parse(readFileSync(url, 'utf8'))
pkg.name = id
pkg.notyra.displayName = displayName
const result = parseManifest(JSON.stringify(pkg))
if (!result.ok) throw new Error(JSON.stringify(result.errors, null, 2))
writeFileSync(url, `${JSON.stringify(pkg, null, 2)}\n`)
console.log(
  'Updated package.json. Run pnpm install to refresh the lockfile, then pnpm build.'
)
