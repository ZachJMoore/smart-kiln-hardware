require("dotenv").config()
const passel = require("passeljs")
const { exposedComponentFunctions } = passel
const Kiln = require("./app/components/Kiln")
const firingSchedule = require("./firingSchedule.json")

// Start application

passel.use(Kiln)

passel.mountComponents()

exposedComponentFunctions.Kiln.startFiring(firingSchedule)