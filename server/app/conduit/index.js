const requestQueue = require("./requestQueue")
const fsStore = require("../fsStore/index.js")
const kiln = require("../kiln/index.js")
const dataConstructors = require("../lib/dataHelpers/constructors/index.js")
const remoteIo = require("../remoteIo/index.js")

class Conduit{
    constructor(){

        this.kilnLog = fsStore.kilnLog.getKilnLog()
        this.kilnData = fsStore.kilnData.getKilnData()
        this.command = fsStore.receivedCommands.getCommand()
        this.tick = 1*60*1000

        if (this.kilnData && this.kilnData.is_firing){
            // something went wrong, we were supposed to be firing
        }

        this.addTemperatureDatapoint = ()=>{
            let datapoint = dataConstructors.temperatureDatapoint(kiln.temperature)
            requestQueue.addTemperatureDatapoint(datapoint)
            fsStore.logData.addTemperatureDatapoint(datapoint)
        }

        this.addLogDatapoint = ()=>{
            let datapoint = dataConstructors.LogDatapoint(this.kilnLog.local_id, kiln.temperature)
            requestQueue.addLogDatapoint(datapoint)
            fsStore.logData.addLogDatapoint(datapoint)
        }

        this.startLogInterval = ()=>{
            this.logInterval = setInterval(()=>{
                this.addLogDatapoint()
            }, this.tick)
        }

        this.stopLogInterval = ()=>{
            clearInterval(this.logInterval)
        }

        this.startLog = (scheduleId)=>{
            let logId = this.fsStore.kilnLog.incrementLocalId()
            this.kilnLog = dataConstructors.startLog(logId, scheduleId)
            requestQueue.addStartLog(this.kilnLog)
            this.fsStore.kilnLog.setKilnLog(this.kilnLog)
            this.startLogInterval()
        }

        this.endLog = ()=>{
            requestQueue.addEndLog(this.kilnLog)
            this.kilnLog = null
            this.fsStore.kilnLog.setKilnLog(null)
            this.stopLogInterval()
        }

        this.mainIntervalFunction = ()=>{
            this.addTemperatureDatapoint()
            fsStore.kilnData.setKilnData(kiln.getKilnData())
            remoteIo.socket.emit("get-firing-schedules", (error)=>{
                console.log(error)
            })
        }

        this.startMainInterval = ()=>{
            this.mainInterval = setInterval(this.mainIntervalFunction, 10*1000)
        }

        this.stopMainInterval = ()=>{
            clearInterval(this.mainInterval)
        }

        remoteIo.socket.on("authenticated", this.mainIntervalFunction)

        this.startMainInterval()

        remoteIo.socket.on("firing-schedules", (data)=>{
            fsStore.firingSchedules.setAllDatabaseSchedules(data)
        })

        kiln.on("firingStarted", (scheduleId)=>{
            this.startLog(scheduleId)
        })

        kiln.on("firingStopped", ()=>{
            this.endLog()
        })

    }
}

module.exports = new Conduit()