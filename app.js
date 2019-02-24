require("dotenv").config()
const passel = require("passeljs")
const dispatcher = require("./app/dispatcher")
const Kiln = require("./app/components/Kiln")
const Authentication = require("./app/components/Authentication")

// Start application

passel.use(Kiln)
passel.use(Authentication)

passel.mountComponents()