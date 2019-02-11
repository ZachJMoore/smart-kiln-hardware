const remoteIo = require("../remoteIo/index.js")
const conduit = require("../conduit/index.js")
const fsStore = require("../fsStore/index.js")
const kiln = require("../kiln/index.js")

module.exports = (io)=>{
    io.on("connection", (socket)=>{

        socket.emit("current_temperature", kiln.temperature)

        socket.emit("current_temperature_datapoints", fsStore.logData.getTemperatureDatapoints())

        socket.emit("firing_schedules", fsStore.firingSchedules.getAllDatabaseSchedules())

        socket.on("get-firing_schedules", ()=>{
            socket.emit("firing_schedules", fsStore.firingSchedules.getAllDatabaseSchedules())
        })

    })

    setInterval(()=>{
        io.emit("current_temperature", kiln.temperature)
    }, 5*1000)

    setInterval(()=>{
        io.emit("current_temperature_datapoints", fsStore.logData.getTemperatureDatapoints())
    }, 60*1000)

    // remoteIo.socket.on("account-data", (data)=>{
    //     io.emit("account-data", data)
    // })
    // remoteIo.socket.on("firing-schedules", (data)=>{
    //     io.emit("firing-schedules", data)
    // })

}