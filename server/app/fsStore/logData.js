const Base = require("./Base.js")

class LogData extends Base{
    constructor(props){
        super(props)

        this.directory = this.directory.cwd("logData")

        this.temperatureDatapointExpirationMilliseconds = (process.env.LOCAL_TEMPERATURE_DATAPOINT_EXPIRATION_DAYS || 1) * 24 * 60 * 60 * 1000
        this.logMaxCount = process.env.LOCAL_LOG_MAX_COUNT || 10

        this.trimTemperatureDatapoints = (datapoints)=>{
            if (process.env.TRIM_QUEUE === "false") return datapoints
            return datapoints.filter((datapoint, index)=>{
                let expiration = Date.now() - this.temperatureDatapointExpirationMilliseconds
                if (datapoint.created_at < expiration) return false
                else return true
            })
        }

        this.addTemperatureDatapoint = (datapoint)=>{
            let previousData = this.directory.read("temperature_datapoints.json", "json")
            if (!Array.isArray(previousData)){
                previousData = []
            } else {
                previousData = this.trimTemperatureDatapoints(previousData)
            }
            previousData.push(datapoint)
            this.directory.write("temperature_datapoints.json", previousData, {
                atomic: true
            })
        }

        this.getTemperatureDatapoints = ()=>{
            let data = this.directory.read("temperature_datapoints.json", "json")
            if (!data) {
                data = []
            } else {
                data = this.trimTemperatureDatapoints(data)
            }
            return data
        }



        this.addCommandUpdate = (id)=>{
            let commands = this.getAllCommandUpdates()
            if (!commands) {
                commands = []
            }
            commands.push(id)
            this._setAllCommandUpdates(commands)
        }

        this.getAllCommandUpdates = ()=>{
            let data = this.directory.read("command_updates.json", "json")
            if (!data) {
                data = []
            }
            return data
        }

        // Kiln/Firing Logs
        this._trimLogs = (logs)=>{
            if (process.env.TRIM_QUEUE === "false") return logs

            let ar = logs.slice()
            let spliceCount = ar.length - this.logMaxCount
            let dTrim = ar.splice(0, spliceCount)
            dTrim.forEach(log=>{
                this._trimLogDatapoints(log.local_id)
                this._trimEndLogs(log.local_id)
            })

            return ar
        }

        this._trimLogDatapoints = (id)=>{
            let tld = this.getAllLogDatapoints().filter((datapoint, index)=>{
                if (datapoint.local_id === id) return false
                else return true
            })

            this.directory.write("log_datapoints.json", tld, {
                atomic: true
            })
        }

        this.addStartLog = (log)=>{
            let previousData = this.directory.read("start_logs.json", "json")
            if (!previousData){
                previousData = []
            } else {
                previousData = this._trimLogs(previousData)
            }
            previousData.push(log)
            this.directory.write("start_logs.json", previousData, {
                atomic: true
            })
        }

        this.getAllStartLogs = ()=>{
            let data = this.directory.read("start_logs.json", "json")
            if (!data) return []
            else return data
        }

        this.addEndLog = (log)=>{
            let previousData = this.directory.read("end_logs.json", "json")
            if (!previousData){
                previousData = []
            }
            previousData.push(log)
            this.directory.write("end_logs.json", previousData, {
                atomic: true
            })
        }

        this.getAllEndLogs = ()=>{
            let data = this.directory.read("end_logs.json", "json")
            if (!data) return []
            else return data
        }

        this.addLogDatapoint = (datapoint)=>{
            let previousData = this.directory.read("log_datapoints.json", "json")
            if (!previousData){
                previousData = []
            }
            previousData.push(datapoint)
            this.directory.write("log_datapoints.json", previousData, {
                atomic: true
            })
        }
        this.getLogDatapointsById = (id)=>{
            let rt = []
            let data = this.directory.read("log_datapoints.json", "json")
            if (!data || data.length === 0) return rt
            else {
                rt = data.filter((datapoint)=>datapoint.local_id === id)
            }
            return rt
        }
        this.getAllLogDatapoints = ()=>{
            let data = this.directory.read("log_datapoints.json", "json")
            if (!data) return []
            else return data
        }
    }
}

module.exports = new LogData()