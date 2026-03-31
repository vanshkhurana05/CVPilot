import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd(), 'dist', 'generated', 'prisma')

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.isFile() && full.endsWith('.js')) fixFile(full)
  }
}

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8')
  // Add .js to relative import/export specifiers that don't have an extension
  // Avoid touching imports from packages (no leading ./ or ../)
  content = content.replace(/(from\s+['"])(\.\/|\.\.\/)([^'";]+)['"]/g, (m, p1, p2, p3) => {
    // if it already has an extension, leave it
    if (/\.[a-zA-Z0-9]+$/.test(p3)) return m
    return `${p1}${p2}${p3}.js"`
  })
  // also handle import\s+"./foo" style
  content = content.replace(/(import\s+['"])(\.\/|\.\.\/)([^'";]+)['"]/g, (m, p1, p2, p3) => {
    if (/\.[a-zA-Z0-9]+$/.test(p3)) return m
    return `${p1}${p2}${p3}.js"`
  })
  fs.writeFileSync(file, content, 'utf8')
}

if (fs.existsSync(root)) walk(root)
else console.warn('Prisma dist folder not found, skipping import-fix.')
