require("dotenv").config()
const passel = require("passeljs")
const Kiln = require("./app/components/Kiln")
const Authentication = require("./app/components/Authentication")
const Schedules = require("./app/components/Schedules")
const FiringLogger = require("./app/components/FiringLogger")
const DatapointLogger = require("./app/components/DatapointLogger")
const firingSchedule = require("./firingSchedule.json")
const dispatcher = require("./app/dispatcher")

// Start application


passel.setGlobalDefaults({
    socket: null,
})
passel.use(Authentication)
passel.use(Kiln)
passel.use(Schedules)
passel.use(FiringLogger)
passel.use(DatapointLogger)

passel.mountComponents()

// setInterval(()=>{

//     const used = process.memoryUsage().heapUsed / 1024 / 1024;
//     console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

// }, 1000)

// dispatcher.startFiring(firingSchedule)

// setTimeout(()=>{
//     dispatcher.cancelFiring(firingSchedule)
// }, 30*1000)

setTimeout(()=>{
    dispatcher.startFiring(firingSchedule)

    setTimeout(()=>{
        dispatcher.cancelFiring()
    }, 30*1000)
}, 10*1000)