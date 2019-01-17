const remoteIo = require("../remoteIo/index.js")
const fsStore = require("../fsStore/index.js")

class RequestQueue{
    constructor(){

        this.inQueue = {
            commandUpdates: false,
            temperatureDatapoints: false,
            startLogs: false,
            endLogs: false,
            logDatapoints: false
        }

        this.queueCommandUpdate = (command)=>{
            this.inQueue.commandUpdates = true
            fsStore.queue.addCommandUpdate(command)
        }

        this.queueTemperatureDatapoint = (datapoint) =>{
            this.inQueue.temperatureDatapoints = true
            fsStore.queue.addTemperatureDatapoint(datapoint)
        }

        this.queueStartLog = (startLog)=>{
            this.inQueue.startLogs = true
            fsStore.queue.addStartLog(startLog)
        }

        this.queueEndLog = (endLog) =>{
            this.inQueue.endLogs = true
            fsStore.queue.addEndLog(endLog)
        }

        this.queueLogDatapoint = (logDatapoint)=>{
            this.inQueue.logDatapoints = true
            fsStore.queue.addLogDatapoint(logDatapoint)
        }

        this.updateCommand = (command) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("update-commands", command, (error)=>{
                    if (error) this.queueCommandUpdate(command)
                })
            } else {
                this.queueCommandUpdate(command)
            }
        }

        this.addTemperatureDatapoint = (datapoint) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-temperature-datapoint", command, (error)=>{
                    if (error) this.queueTemperatureDatapoint(datapoint)
                })
            } else {
                this.queueTemperatureDatapoint(datapoint)
            }
        }

        this.startLog = (startLog) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-start-log", startLog, (error)=>{
                    if (error) this.queueStartLog(startLog)
                })
            } else {
                this.queueStartLog(startLog)
            }
        }

        this.endLog = (endLog) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-end-log", startLog, (error)=>{
                    if (error) this.queueStartLog(endLog)
                })
            } else {
                this.queueStartLog(endLog)
            }
        }

        this.addLogDatapoint = (logDatapoint) => {
            if (remoteIo.isAuthenticated){
                remoteIo.socket.emit("add-end-log", startLog, (error)=>{
                    if (error) this.queueLogDatapoint(logDatapoint)
                })
            } else {
                this.queueLogDatapoint(logDatapoint)
            }
        }
    }
}

module.exports = new RequestQueue