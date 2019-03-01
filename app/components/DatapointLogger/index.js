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
        let datapoint = this.getDatapoint()

        let datapoints = [...this.state.datapoints, datapoint]
        this.trimDatapoints(datapoints)

        let backupDatapoints = [...this.state.backupDatapoints, datapoint]
        this.trimDatapoints(backupDatapoints, true)

        if (!this.global.Authentication.socketIsAuthenticated){

            // If we aren't authenticated: backup datapoints
            this.setState({
                datapoints,
                backupDatapoints
            })

        } else {
            this.global.socket.emit("bulk-add-temperature-datapoints", backupDatapoints, (error)=>{
                if (error){
                    throw new Error(error.message)
                } else {
                    backupDatapoints = []
                }

                this.setState({
                    datapoints,
                    backupDatapoints
                })
                if (!error) this.ensureFsState()
            })
        }
    }

    componentWillMount(){
        this.globalChanged.on("Authentication.socketIsAuthenticated", (socketIsAuthenticated)=>{
            if (socketIsAuthenticated){
                this.global.socket.emit("bulk-add-temperature-datapoints", this.state.backupDatapoints, (error)=>{
                    if (error){
                        throw new Error(error.message)
                    } else {
                        this.setState({
                            backupDatapoints: []
                        })
                        this.ensureFsState()
                    }
                })
            }
        })
    }

    componentDidMount(){
        this.trackDatapoints()
        setInterval(()=>{
            this.trackDatapoints()
        }, (process.env.DATAPOINT_UPDATE_INTERVAL_SECONDS || 60) * 1000)
    }
}