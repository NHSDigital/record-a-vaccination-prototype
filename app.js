const express = require('express')
const NHSPrototypeKit = require('nhsuk-prototype-kit')
const path = require('path')
const nunjucks = require('nunjucks')
const session = require('express-session')
const { join } = require('node:path')

// Local dependencies
const config = require('./app/config')
const locals = require('./app/locals')
const routes = require('./app/routes')
const filters = require('./app/filters')
const sessionDataDefaults = require('./app/data/session-data-defaults')

// Set configuration variables
const port = parseInt(process.env.PORT || config.port, 10) || 2000

// Initialise applications
const app = express()

// Add variables that are available in all views
app.locals.asset_path = '/public/'
// app.locals.serviceName = config.serviceName

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

// Use session
app.use(
  session({
    secret: 'nhsuk-prototype-kit',
    resave: false,
    saveUninitialized: true
  })
)

// Local variables
// app.use(locals(config))

// Use public folder for static assets
app.use(express.static(join(__dirname, 'public')))

// Use assets from NHS frontend
app.use(
  '/nhsuk-frontend',
  express.static(join(__dirname, 'node_modules/nhsuk-frontend/dist/nhsuk'))
)

function setSessionDataDefaults(req, res, next) {
  if (!req.session.data) {
    req.session.data = {}
  }

  // req.session.data = Object.assign({}, sessionDataDefaults, req.session.data)

  // Send session data to all views
  res.locals.data = {}
  for (const j in req.session.data) {
    res.locals.data[j] = req.session.data[j]
  }

  next()
}

app.use(setSessionDataDefaults)

NHSPrototypeKit.init(app, nunjucksAppEnv)

// Add custom filters
for (const [name, filter] of Object.entries(filters())) {
  nunjucksAppEnv.addFilter(name, filter)
}

// Use custom application routes
app.use('/', routes)


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
