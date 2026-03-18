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

const original = "bodyParser.urlencoded({ extended: true, limit: '10mb'})"
const patched =
  "bodyParser.urlencoded({ extended: true, limit: '10mb', parameterLimit: 10000 })"

try {
  let content = fs.readFileSync(filePath, 'utf8')

  if (content.includes(patched)) {
    console.log('✓ parameterLimit already patched')
  } else if (content.includes(original)) {
    content = content.replace(original, patched)
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('✓ Patched parameterLimit to 10000 in nhsuk-prototype-kit')
  } else {
    console.warn('⚠ Could not find expected body-parser config to patch')
  }
} catch (err) {
  console.error('⚠ Failed to patch body-parser:', err.message)
}
