import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
if (
  !process.argv.includes('--skip-tag-check') && process.env.GITHUB_REF_TYPE === 'tag' &&
  process.env.GITHUB_REF_NAME !== `v${pkg.version}`
)
  throw new Error('Release tag must match package.json version')
const files = new Map()
const manifest = Object.fromEntries(
  ['name', 'version', 'type', 'description', 'author', 'license', 'notyra']
    .filter(key => key in pkg)
    .map(key => [key, pkg[key]])
)
files.set('package.json', Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`))
function collect(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const full = resolve(path, entry.name)
    if (entry.isSymbolicLink()) throw new Error('Symlinks cannot be packaged')
    if (entry.isDirectory()) collect(full)
    else
      files.set(relative(root, full).replaceAll('\\', '/'), readFileSync(full))
  }
}
if (pkg.notyra.type === 'feature') collect(resolve(root, 'dist'))
else {
  for (const key of ['theme', 'themeCss'])
    if (pkg.notyra[key])
      files.set(pkg.notyra[key], readFileSync(resolve(root, pkg.notyra[key])))
}
for (const key of pkg.notyra.type === 'feature'
  ? ['main']
  : ['theme', 'themeCss'])
  if (pkg.notyra[key] && !files.has(pkg.notyra[key]))
    throw new Error(`Missing ${pkg.notyra[key]}`)
const crc32 = data => {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
  }
  return (crc ^ 0xffffffff) >>> 0
}
const chunks = [],
  central = []
let offset = 0
for (const [path, data] of files) {
  const name = Buffer.from(path),
    checksum = crc32(data)
  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50)
  local.writeUInt16LE(20, 4)
  local.writeUInt16LE(0x800, 6)
  local.writeUInt16LE(0x21, 12)
  local.writeUInt32LE(checksum, 14)
  local.writeUInt32LE(data.length, 18)
  local.writeUInt32LE(data.length, 22)
  local.writeUInt16LE(name.length, 26)
  const dir = Buffer.alloc(46)
  dir.writeUInt32LE(0x02014b50)
  dir.writeUInt16LE(20, 4)
  dir.writeUInt16LE(20, 6)
  dir.writeUInt16LE(0x800, 8)
  dir.writeUInt16LE(0x21, 14)
  dir.writeUInt32LE(checksum, 16)
  dir.writeUInt32LE(data.length, 20)
  dir.writeUInt32LE(data.length, 24)
  dir.writeUInt16LE(name.length, 28)
  dir.writeUInt32LE(offset, 42)
  chunks.push(local, name, data)
  central.push(dir, name)
  offset += local.length + name.length + data.length
}
const directory = Buffer.concat(central),
  end = Buffer.alloc(22)
end.writeUInt32LE(0x06054b50)
end.writeUInt16LE(files.size, 8)
end.writeUInt16LE(files.size, 10)
end.writeUInt32LE(directory.length, 12)
end.writeUInt32LE(offset, 16)
const zip = Buffer.concat([...chunks, directory, end])
if (zip.length > 20 * 1024 * 1024)
  throw new Error('Package exceeds the 20 MiB download limit')
writeFileSync(resolve(root, 'notyra-plugin.zip'), zip)
console.log(
  `Created ${pkg.name}@${pkg.version}: notyra-plugin.zip (${zip.length} bytes)`
)
