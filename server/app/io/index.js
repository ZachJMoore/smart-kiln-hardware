const remoteIo = require("../remoteIo/index.js")
const conduit = require("../conduit/index.js")
const fsStore = require("../fsStore/index.js")
const kiln = require("../kiln/index.js")

module.exports = (io)=>{
    io.on("connection", (socket)=>{

        socket.emit("current-temperature", kiln.temperature)

        socket.emit("current-temperature-datapoints", fsStore.logData.getTemperatureDatapoints())

        socket.emit("firing-schedules", fsStore.firingSchedules.getAllDatabaseSchedules())

        socket.on("get-firing-schedules", ()=>{
            socket.emit("firing-schedules", fsStore.firingSchedules.getAllDatabaseSchedules())
        })

        socket.on("start-firing-schedule", (scheduleId, callback)=>{
            console.log(scheduleId)
            let schedule = fsStore.firingSchedules.getDatabaseScheduleById(scheduleId)
            if (!schedule) return callback("No firing schedule was found.")
            else if (kiln.isFiring) return callback("Kiln is already currently in progress")

            kiln.startFiring(schedule)

            return callback(null)
        })

        socket.on("stop-firing-schedule", (callback)=>{
            kiln.stopFiring()
            if (kiln.isFiring) return callback("Something went wrong stopping the kiln.")
            return callback(null)
        })


        let kilnState = kiln.getKilnData()
        socket.emit("kiln-state", kilnState)

        if (kiln.isFiring){

            socket.emit("firing-schedule-log-datapoints", fsStore.logData.getLogDatapointsById(fsStore.kilnLog.getKilnLog().local_id))
            socket.emit("firing-schedule-started", kiln.currentSchedule, fsStore.kilnLog.getKilnLog())

        }


    })

    kiln.on("firingStarted", (schedule)=>{
        io.emit("firing-schedule-log-datapoints", fsStore.logData.getLogDatapointsById(fsStore.kilnLog.getKilnLog().local_id))
        io.emit("firing-schedule-started", schedule, fsStore.kilnLog.getKilnLog())
        io.emit("kiln-state", kiln.getKilnData())
    })
    kiln.on("firingEnded", ()=>{
        io.emit("firing-schedule-ended")
        io.emit("kiln-state", kiln.getKilnData())
    })
    kiln.on("firingCompleted", ()=>{
        io.emit("firing-schedule-completed")
        io.emit("kiln-state", kiln.getKilnData())
    })

    setInterval(()=>{
        io.emit("current-temperature", kiln.temperature)
        io.emit("kiln-state", kiln.getKilnData())
    }, 5*1000)

    setInterval(()=>{
        io.emit("current-temperature-datapoints", fsStore.logData.getTemperatureDatapoints())
        io.emit("kiln-state", kiln.getKilnData())
        if (kiln.isFiring){
            io.emit("firing-schedule-log-datapoints", fsStore.logData.getLogDatapointsById(fsStore.kilnLog.getKilnLog().local_id))
        }
    }, 60*1000)

    // remoteIo.socket.on("account-data", (data)=>{
    //     io.emit("account-data", data)
    // })
    // remoteIo.socket.on("firing-schedules", (data)=>{
    //     io.emit("firing-schedules", data)
    // })

}