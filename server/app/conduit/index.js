const requestQueue = require("./requestQueue")
const fsStore = require("../fsStore/index.js")
const kiln = require("../kiln/index.js")
const dataConstructors = require("../lib/dataHelpers/constructors/index.js")
const remoteIo = require("../remoteIo/index.js")
const commandController = require("./commandController.js")

class Conduit{
    constructor(){

        this.kilnLog = fsStore.kilnLog.getKilnLog()
        this.kilnData = fsStore.kilnData.getKilnData()
        this.accountData = fsStore.authentication.getAccountData()
        this.logDatapointIntervalTick = (process.env.LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS || 60 ) * 1000
        this.temperatureDatapointIntervalTick = (process.env.LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS || 60 ) * 1000
        this.realtimeDataUpdateIntervalTick = (process.env.REALTIME_DATA_EMIT_INTERVAL_SECONDS || 15) * 1000
        this.logDatapointInterval = null
        this.temperatureDatapointInterval = null
        this.realtimeDataUpdateInterval = null

        // Temperature datapoint interval
        this._addTemperatureDatapoint = ()=>{
            let datapoint = dataConstructors.temperatureDatapoint(kiln.temperature)
            requestQueue.addTemperatureDatapoint(datapoint)
            fsStore.logData.addTemperatureDatapoint(datapoint)
        }

        this._startTemperatureDatapointInterval = ()=>{
            this._stopTemperatureDatapointInterval()
            this.temperatureDatapointInterval = setInterval(()=>{
                this._addTemperatureDatapoint()
            }, this.temperatureDatapointIntervalTick)
        }

        this._stopTemperatureDatapointInterval = ()=>{
            clearInterval(this.temperatureDatapointIntervalInterval)
        }

        // Log datapoint interval
        this._addLogDatapoint = ()=>{
            let datapoint = dataConstructors.logDatapoint()
            requestQueue.addLogDatapoint(datapoint)
            fsStore.logData.addLogDatapoint(datapoint)
        }

        this._startLogInterval = ()=>{
            this._stopLogDatapointInterval()
            this.logDatapointInterval = setInterval(()=>{
                this._addLogDatapoint()
            }, this.logDatapointIntervalTick)
        }

        this._stopLogDatapointInterval = ()=>{
            clearInterval(this.logDatapointInterval)
            this.logDatapointInterval = null
        }

        // realtime data interval
        this._updateRealtimeData = ()=>{
            let data = kiln.getKilnData()
            fsStore.kilnData.setKilnData(data)
            remoteIo.socket.emit("update-realtime-data", data, (error)=>{

            })
        }

        this._startRealtimeDataUpdateInterval = ()=>{
            this._stopRealtimeDataUpdateInterval()
            this.realtimeDataUpdateInterval = setInterval(()=>{
                this._updateRealtimeData()
            }, this.realtimeDataUpdateIntervalTick)
        }

        this._stopRealtimeDataUpdateInterval = ()=>{
            clearInterval(this.logDatapointInterval)
            this.logDatapointInterval = null
        }

        // starting and stopping logs
        this._startLog = (scheduleId)=>{
            this.kilnLog = dataConstructors.startLog(scheduleId)
            requestQueue.addStartLog(this.kilnLog)
            fsStore.logData.addStartLog(this.kilnLog)
            fsStore.kilnLog.setKilnLog(this.kilnLog)
            this._startLogInterval()
        }

        this._endLog = ()=>{
            requestQueue.addEndLog(this.kilnLog)
            fsStore.logData.addEndLog(this.kilnLog)
            this.kilnLog = null
            fsStore.kilnLog.setKilnLog({})
            this._stopLogDatapointInterval()
        }

        // Start doing stuff ---------------------------------------------------------------------------------------------

        if (this.kilnData && this.kilnData.is_firing){
            console.log("Firing was interrupted!!")

            this._endLog()
            this._updateRealtimeData()
        }

        // if (this.accountData.realtimeData !== this.kilnData){ do stuff }

        // remote Io

        remoteIo.socket.on("firing-schedules", (data)=>{
            fsStore.firingSchedules.setAllDatabaseSchedules(data)
        })

        remoteIo.socket.on("authenticated", ()=>{
            remoteIo.socket.emit("get-commands", (error)=>{

            })
            remoteIo.socket.emit("get-all-firing-schedules", (error)=>{

            })
        })

        // Kiln
        kiln.on("firingStarted", (schedule)=>{
            this._startLog(schedule.id)
        })

        kiln.on("firingEnded", ()=>{
            this._endLog()
        })
        kiln.on("firingCompleted", ()=>{
            this._endLog()
        })

        // startup

        this._startTemperatureDatapointInterval()
        this._startRealtimeDataUpdateInterval()

    }
}

module.exports = new Conduit()