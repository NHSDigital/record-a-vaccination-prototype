// External dependencies
const express = require('express');

const router = express.Router();

require('./routes/regions')(router)
require('./routes/user-admin')(router)
require('./routes/user-onboarding')(router)
require('./routes/user-profile')(router)
require('./routes/vaccines')(router)

module.exports = router;
