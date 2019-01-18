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
        this.logDatapointIntervalTick = (process.env.LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS || 60 ) * 1000
        this.temperatureDatapointIntervalTick = (process.env.LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS || 60 ) * 1000
        this.realtimeDataUpdateIntervalTick = (process.env.REALTIME_DATA_EMIT_INTERVAL_SECONDS || 15) * 1000
        this.logDatapointInterval = null
        this.temperatureDatapointInterval = null
        this.realtimeDataUpdateInterval = null

        if (this.kilnData && this.kilnData.is_firing){
            // something went wrong, we were supposed to be firing
        }

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
            let datapoint = dataConstructors.LogDatapoint(this.kilnLog.local_id, kiln.temperature)
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
            fsStore.kilnLog.setKilnLog(this.kilnLog)
            this._startLogInterval()
        }

        this._endLog = ()=>{
            requestQueue.addEndLog(this.kilnLog)
            this.kilnLog = null
            fsStore.kilnLog.setKilnLog(null)
            this._stopLogInterval()
        }

        // extra
        this._startupFunctions = ()=>{
            this._startTemperatureDatapointInterval()
            this._startRealtimeDataUpdateInterval()
        }

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
        kiln.on("firingStarted", (scheduleId)=>{
            this._startLog(scheduleId)
        })

        kiln.on("firingStopped", ()=>{
            this._endLog()
        })

        // startup
        this._startupFunctions()

    }
}

module.exports = new Conduit()