require("dotenv").config()
const passel = require("passeljs")
const dispatcher = require("./app/dispatcher")
const Kiln = require("./app/components/Kiln")
const firingSchedule = require("./firingSchedule.json")

// Start application

passel.use(Kiln)

passel.mountComponents()