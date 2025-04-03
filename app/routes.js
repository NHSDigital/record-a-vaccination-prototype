// External dependencies
const express = require('express');

const router = express.Router();

require('./routes/record-vaccinations')(router)
require('./routes/regions')(router)
require('./routes/user-admin')(router)
require('./routes/user-onboarding')(router)
require('./routes/user-profile')(router)
require('./routes/vaccines')(router)
require('./routes/reports')(router)
require('./routes/find-record')(router)
require('./routes/prototype-admin')(router)
require('./routes/support')(router)
require('./routes/auth')(router)
require('./routes/home')(router)



module.exports = router;
