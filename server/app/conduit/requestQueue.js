const remoteIo = require("../remoteIo/index.js")
const fsStore = require("../fsStore/index.js")

class RequestQueue{
    constructor(){

        this.inQueue = {
            commandUpdates: true,
            temperatureDatapoints: true,
            startLogs: true,
            endLogs: true,
            logDatapoints: true
        }

        this._queueCommandUpdate = (commandId)=>{
            this.inQueue.commandUpdates = true
            fsStore.queue.addCommandUpdate(commandId)
        }

        this._queueTemperatureDatapoint = (datapoint) =>{
            this.inQueue.temperatureDatapoints = true
            fsStore.queue.addTemperatureDatapoint(datapoint)
        }

        this._queueStartLog = (startLog)=>{
            this.inQueue.startLogs = true
            fsStore.queue.addStartLog(startLog)
        }

        this._queueEndLog = (endLog) =>{
            this.inQueue.endLogs = true
            fsStore.queue.addEndLog(endLog)
        }

        this._queueLogDatapoint = (logDatapoint)=>{
            this.inQueue.logDatapoints = true
            fsStore.queue.addLogDatapoint(logDatapoint)
        }

        this.updateCommand = (commandId) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("update-commands", commandId, (error)=>{
                    if (error) this._queueCommandUpdate(commandId)
                })
            } else {
                this._queueCommandUpdate(command)
            }
        }

        this.addTemperatureDatapoint = (datapoint) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-temperature-datapoint", datapoint, (error)=>{
                    if (error) this._queueTemperatureDatapoint(datapoint)
                })
            } else {
                this._queueTemperatureDatapoint(datapoint)
            }
        }

        this.addStartLog = (startLog) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-start-log", startLog, (error)=>{
                    if (error) this._queueStartLog(startLog)
                })
            } else {
                this._queueStartLog(startLog)
            }
        }

        this.addEndLog = (endLog) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-end-log", endLog, (error)=>{
                    if (error) this._queueStartLog(endLog)
                })
            } else {
                this._queueStartLog(endLog)
            }
        }

        this.addLogDatapoint = (logDatapoint) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-log-datapoint", logDatapoint, (error)=>{
                    if (error) this._queueLogDatapoint(logDatapoint)
                })
            } else {
                this._queueLogDatapoint(logDatapoint)
            }
        }



        // -----------------------------------------------------------------------------------------------------------------------



        this._bulkUpdateCommands = (commandIds) => {
                remoteIo.socket.emit("bulk-update-commands", commandIds, (error)=>{
                    if (!error){
                        fsStore.queue.deleteAllCommandUpdates()
                        this.inQueue.commandUpdates = false
                    }
                })
        }

        this._bulkAddTemperatureDatapoints = (datapoints) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("bulk-add-temperature-datapoints", datapoints, (error)=>{
                    console.log(error)
                    if (!error){
                        fsStore.queue.deleteAllTemperatureDatapoints()
                        this.inQueue.temperatureDatapoints = false
                    }
                })
            } else {

            }
        }

        this._bulkAddStartLogs = (startLogs) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("bulk-add-start-logs", startLogs, (error)=>{
                    if (!error){
                        fsStore.queue.DeleteAllStartLogs()
                        this.inQueue.startLogs = false
                    }
                })
            } else {

            }
        }

        this._bulkAddEndLogs = (endLogs) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("bulk-add-end-logs", endLogs, (error)=>{
                    if (!error){
                        fsStore.queue.deleteAllEndLogs()
                        this.inQueue.endLogs = false
                    }
                })
            } else {

            }
        }

        this._bulkAddLogDatapoints = (logDatapoints) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("bulk-add-log-datapoints", logDatapoints, (error)=>{
                    if (!error){
                        fsStore.queue.DeleteALLLogDatapoints()
                        this.inQueue.logDatapoints = false
                    }
                })
            } else {

            }
        }

        this._updateCommandUpdates = ()=>{
            let commandUpdates = fsStore.queue.getAllCommandUpdates()
            if (commandUpdates && commandUpdates.length > 0){
                this._bulkUpdateCommands(commandUpdates)
            }
        }

        this._updateTemperatureDatapoints = () =>{
            let temperatureDatapoints = fsStore.queue.getTemperatureDatapoints()
            if (temperatureDatapoints && temperatureDatapoints.length > 0){
                this._bulkAddTemperatureDatapoints(temperatureDatapoints)
            }
        }

        this._updateStartLogs = ()=>{
            let startLogs = fsStore.queue.getAllStartLogs()
            if (startLogs && startLogs.length > 0){
                this._bulkAddStartLogs(startLogs)
            }
        }

        this._updateEndLogs = () =>{
            let endLogs = fsStore.queue.getAllEndLogs()
            if (endLogs && endLogs.length > 0){
                this._bulkAddEndLogs(endLogs)
            }
        }

        this._updateLogDatapoints = ()=>{
            let logDatapoints = fsStore.queue.getAllLogDatapoints()
            if (logDatapoints && logDatapoints.length > 0){
                this._bulkAddLogDatapoints(logDatapoints)
            }
        }

        this._updateDatabase = ()=>{

            if (this.inQueue.commandUpdates){
                this._updateCommandUpdates()
            }

            if (this.inQueue.temperatureDatapoints){
                this._updateTemperatureDatapoints()
            }

            if (this.inQueue.startLogs){
                this._updateStartLogs()
            }

            if (this.inQueue.endLogs){
                this._updateEndLogs()
            }

            if (this.inQueue.logDatapoints){
                this._updateLogDatapoints()
            }
        }

        remoteIo.socket.on("authenticated", this._updateDatabase)
    }
}

module.exports = new RequestQueue()