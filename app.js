const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const path = require('path')
const nunjucks = require('nunjucks')
const { join } = require('node:path')

// Local dependencies
const locals = require('./app/locals')
const routes = require('./app/routes')
const filters = require('./app/filters')
const sessionDataDefaults = require('./app/data/session-data-defaults')

const SERVICE_NAME = 'Record a vaccination'

// Set configuration variables
const port = parseInt(process.env.PORT, 10) || 2000

// Initialise applications
const app = express()

// Add variables that are available in all views
app.locals.asset_path = '/public/'

// Nunjucks configuration for application
const appViews = [
  join(__dirname, 'app/views/'),
  join(__dirname, 'app/components/'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk/components'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk/macros'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk'),
  join(__dirname, 'node_modules/nhsuk-frontend/dist')
]

let nunjucksAppEnv = nunjucks.configure(appViews, { express: app, noCache: true })


// Use public folder for static assets
app.use(express.static(join(__dirname, 'public')))

// Use assets from NHS frontend
app.use(
  '/nhsuk-frontend',
  express.static(join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk'))
)

NHSPrototypeKit.init({
  serviceName: SERVICE_NAME,
  express: app,
  nunjucks: nunjucksAppEnv,
  routes: routes,
  locals: locals,
  sessionDataDefaults: sessionDataDefaults
})



// Add custom filters
for (const [name, filter] of Object.entries(filters())) {
  nunjucksAppEnv.addFilter(name, filter)
}

// Run the application
app.listen(port)

if (
  process.env.WATCH !== 'true' && // If the user isn’t running watch
  process.env.NODE_ENV !== 'production' // and it’s not in production mode
) {
  console.info(`Running at http://localhost:${port}/`)
  console.info('')
  console.warn(
    'Warning: It looks like you may have run the command `npm start` locally.'
  )
  console.warn('Press `Ctrl+C` and then run `npm run watch` instead')
}

module.exports = app

/**
 * @import { ConfigureOptions } from 'nunjucks'
 */
