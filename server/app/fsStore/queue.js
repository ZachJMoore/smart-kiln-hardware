const Base = require("./Base.js")

class Queue extends Base{
    constructor(props){
        super(props)

        this.directory = this.directory.cwd("queue")

        this.temperatureDatapointExpirationMilliseconds = (process.env.QUEUE_TEMPERATURE_DATAPOINT_EXPIRATION_DAYS || 10) * 24 * 60 * 60 * 1000
        this.logMaxCount = process.env.QUEUE_LOG_MAX_COUNT || 30

        this.trimTemperatureDatapoints = (datapoints)=>{
            if (process.env.TRIM_QUEUE === "false") return datapoints
            return datapoints.filter((datapoint, index)=>{
                let expiration = Date.now() - this.temperatureDatapointExpirationMilliseconds
                if (datapoint.created_at < expiration) return false
                else return true
            })
        }

        this.deleteAllTemperatureDatapoints = ()=>{
            this.directory.write("temperature_datapoints.json", [], {
                atomic: true
            })
        }

        this.addTemperatureDatapoint = (datapoint)=>{
            let previousData = this.directory.read("temperature_datapoints", "json")
            if (!previousData){
                previousData = []
            } else {
                previousData = this.trimTemperatureDatapoints(previousData)
            }
            this.previousData.push(datapoint)
            this.directory.write("temperature_datapoints.json", previousData, {
                atomic: true
            })
        }

        this.getTemperatureDatapoints = ()=>{
            let data = this.directory.read("temperature_datapoints", "json")
            if (!data) {
                data = []
            } else {
                data = this.trimTemperatureDatapoints(data)
            }
            return data
        }

        this.trimLogs = (logs)=>{
            if (process.env.TRIM_QUEUE === "false") return logs

            let ar = logs.splice()
            let spliceCount = ar.length - this.logMaxCount
            ar.splice(0, spliceCount)

            return ar
        }

        this.trimLogDatapoints = (id)=>{
            let tld = this.getLogDatapoints().filter((datapoint, index)=>{
                if (datapoint.log_id === id) return false
                else return true
            })

            this.directory.write("log_datapoints.json", tld, {
                atomic: true
            })
        }

        this.deleteAllStartLogs = ()=>{
            this.directory.write("start_logs.json", [], {
                atomic: true
            })
        }

        this.startLog = (log)=>{
            let previousData = this.directory.read("start_logs", "json")
            if (!previousData){
                previousData = []
            } else {
                previousData = this.trimLogDatapoints(previousData)
            }
            this.previousData.push(log)
            this.directory.write("start_logs.json", previousData, {
                atomic: true
            })
        }
        this.getStartLogs = ()=>{
            let data = this.directory.read("start_logs", "json")
            if (!data) return []
            else return data
        }

        this.deleteAllEndLogs = ()=>{
            this.directory.write("end_logs.json", [], {
                atomic: true
            })
        }

        this.endLog = (log)=>{
            let previousData = this.directory.read("end_logs", "json")
            if (!previousData){
                previousData = []
            }
            else {
                previousData = this.trimLogDatapoints(previousData)
            }
            this.previousData.push(log)
            this.directory.write("end_logs.json", previousData, {
                atomic: true
            })
        }
        this.getEndLogs = ()=>{
            let data = this.directory.read("end_logs", "json")
            if (!data) return []
            else return data
        }

        this.deleteAllLogDatapoints = ()=>{
            this.directory.write("log_datapoints.json", [], {
                atomic: true
            })
        }

        this.addLogDatapoint = (datapoint)=>{
            let previousData = this.directory.read("log_datapoints", "json")
            if (!previousData){
                previousData = []
            }
            this.previousData.push(datapoint)
            this.directory.write("log_datapoints.json", previousData, {
                atomic: true
            })
        }
        this.getLogDatapoints = ()=>{
            let data = this.directory.read("log_datapoints", "json")
            if (!data) return []
            else return data
        }
    }
}

module.exports = new Queue()