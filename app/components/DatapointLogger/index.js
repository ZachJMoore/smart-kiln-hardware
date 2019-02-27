const { Components } = require("passeljs");

module.exports = class DatapointLogger extends Components.Base{
    constructor(props){
        super(props)

        this.state = {
            datapoints: [],
            backupDatapoints: [],
        }

        this.options = {
            fsState: {
                recurrentUpdateLimit: (process.env.DATAPOINT_FS_INTERVAL_LIMIT_SECONDS || 600) * 1000,
                options: {
                    include: [
                        {
                            key: "datapoints"
                        },
                        {
                            key: "backupDatapoints"
                        }
                    ]
                }
            },
            globalState:{
                options: {
                    include: [
                        {
                            key: "datapoints",
                            emit: true
                        }
                    ]
                }
            }
        }
    }

    getDatapoint(){
        return {
            temperature: this.global.Kiln.thermoSensor.average,
            created_at: Date.now()
        }
    }

    trimDatapoints(datapoints, isBackup = false){

        let limit = null

        if (isBackup) {
            limit = process.env.DATAPOINT_BACKUP_LIMIT_COUNT
            limit = parseInt(limit)
            if (isNaN(limit)) limit = 720
        } else { 
            limit = process.env.DATAPOINT_LIMIT_COUNT
            limit = parseInt(limit)
            if (isNaN(limit)) limit = 360
        }

        if (datapoints.length > limit){
            let sliceCount = datapoints.length - limit
            datapoints.splice(0, sliceCount)
        }
    }

    trackDatapoints(){
        let shouldEnsureFsState = false
        this.setState((state)=>{
            let datapoint =  this.getDatapoint()

            state.datapoints.push(datapoint)
            this.trimDatapoints(state.datapoints)

            let addedToBackup = false
            if (!this.global.Authentication.socketIsAuthenticated){
                state.backupDatapoints.push(datapoint)
                addedToBackup = true

            } else {
                this.global.socket.emit("bulk-add-temperature-datapoints", [...state.backupDatapoints, datapoint], (error)=>{
                    if (error){
                        console.log(error)
                        state.backupDatapoints.push(datapoint)
                        addedToBackup = true
                    } else {
                        if (state.backupDatapoints.length > 0){
                            shouldEnsureFsState = true
                        }
                        state.backupDatapoints = []
                    }
                })
            }

            if (addedToBackup){
                this.trimDatapoints(state.backupDatapoints, true)
            }

            return state
        })
        if (shouldEnsureFsState) this.ensureFsState()
    }

    componentDidMount(){
        this.trackDatapoints()
        setInterval(()=>{
            this.trackDatapoints()
        }, (process.env.DATAPOINT_UPDATE_INTERVAL_SECONDS || 60) * 1000)
    }
}