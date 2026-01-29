const { join } = require('node:path')

const NHSPrototypeKit = require('nhsuk-prototype-kit')

// Local dependencies
const config = require('./app/config')
const sessionDataDefaults = require('./app/data/session-data-defaults')
const filters = require('./app/filters')
const locals = require('./app/locals')
const routes = require('./app/routes')

const SERVICE_NAME = config.serviceName

// Set configuration variables
const port = parseInt(process.env.PORT, 10) || 2000

const viewsPath = [
  join(__dirname, 'app/views/'),
  join(__dirname, 'app/components/')
]

async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: SERVICE_NAME,
    buildOptions: {
      entryPoints: ['app/assets/sass/main.scss']
    },
    viewsPath,
    routes,
    locals,
    sessionDataDefaults
  })

  // Add custom port number
  prototype.app?.set('port', config.port)

  // Add custom Nunjucks filters
  for (const [name, filter] of Object.entries(filters)) {
    prototype.nunjucks.addFilter(name, filter)
  }

  prototype.start()
}

init()
