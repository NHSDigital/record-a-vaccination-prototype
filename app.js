const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const path = require('path')
const nunjucks = require('nunjucks')
const { join } = require('node:path')

// Local dependencies
const config = require('./app/config')
const locals = require('./app/locals')
const routes = require('./app/routes')
const filters = require('./app/filters')
const sessionDataDefaults = require('./app/data/session-data-defaults')

const SERVICE_NAME = config.serviceName

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

for (const [name, filter] of Object.entries(filters())) {
  nunjucksAppEnv.addFilter(name, filter)
}


// Use public folder for static assets
app.use(express.static(join(__dirname, 'public')))

// Use assets from NHS frontend
app.use(
  '/nhsuk-frontend',
  express.static(join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk'))
)

const prototype = NHSPrototypeKit.init({
  serviceName: SERVICE_NAME,
  express: app,
  nunjucks: nunjucksAppEnv,
  routes: routes,
  locals: locals,
  sessionDataDefaults: sessionDataDefaults,
  buildOptions: {
    entryPoints: ['app/assets/sass/main.scss']
  }
})

prototype.start()
