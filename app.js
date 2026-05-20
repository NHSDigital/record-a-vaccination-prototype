const NHSPrototypeKit = require('nhsuk-prototype-kit')

// Local dependencies
const config = require('./app/config')
const sessionDataDefaults = require('./app/data/session-data-defaults')
const filters = require('./app/filters')
const locals = require('./app/locals')
const routes = require('./app/routes')

const RealDate = Date
if (config.useFixedPrototypeDate && config.fixedPrototypeDate) {
  class FixedDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(config.fixedPrototypeDate)
      } else {
        super(...args)
      }
    }

    static now() {
      return new RealDate(config.fixedPrototypeDate).getTime()
    }

    static parse(value) {
      return RealDate.parse(value)
    }

    static UTC(...args) {
      return RealDate.UTC(...args)
    }
  }

  global.Date = FixedDate
}

const SERVICE_NAME = config.serviceName

const viewsPath = ['app/views/', 'app/components/']

const entryPoints = ['app/assets/sass/main.scss', 'app/assets/javascript/*.js']

async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: SERVICE_NAME,
    buildOptions: {
      entryPoints
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
