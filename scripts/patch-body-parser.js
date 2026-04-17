/**
 * Patches nhsuk-prototype-kit to increase parameterLimit for forms with many fields.
 * This runs automatically after npm install via the postinstall script.
 */

const fs = require('node:fs')
const path = require('node:path')

const filePath = path.join(
  __dirname,
  '../node_modules/nhsuk-prototype-kit/lib/middleware/index.js'
)

try {
  let content = fs.readFileSync(filePath, 'utf8')

  // Check if already patched
  if (/bodyParser\.urlencoded\([^)]*parameterLimit/.test(content)) {
    console.log('✓ parameterLimit already patched')
    // process.exit(0)
  }

  // Match bodyParser.urlencoded({ ... }) and add parameterLimit
  const regex = /(bodyParser\.urlencoded\(\{[^}]+)(}\))/

  if (regex.test(content)) {
    content = content.replace(regex, '$1, parameterLimit: 10000 $2')
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('✓ Patched parameterLimit to 10000 in nhsuk-prototype-kit')
  } else {
    console.warn('⚠ Could not find expected body-parser config to patch')
  }
} catch (err) {
  console.error('⚠ Failed to patch body-parser:', err.message)
}
