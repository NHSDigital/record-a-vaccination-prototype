const NHSPrototypeKit = require('nhsuk-prototype-kit')

// Local dependencies
const config = require('./app/config')
const sessionDataDefaults = require('./app/data/session-data-defaults')
const filters = require('./app/filters')
const locals = require('./app/locals')
const routes = require('./app/routes')

const SERVICE_NAME = config.serviceName

const viewsPath = ['app/views/', 'app/components/']

async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: SERVICE_NAME,
    buildOptions: {
      entryPoints: ['app/assets/sass/main.scss']
    },
    viewsPath,
    routes,
    locals,
    filters,
    sessionDataDefaults
  })

  prototype.start(config.port)
}

init()
