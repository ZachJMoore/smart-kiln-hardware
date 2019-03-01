const { Components } = require("passeljs")

module.exports = class RealtimeData extends Components.Base{
    constructor(props){
        super(props)
    }

    getRealtimeData(){
        return ({
            current_temperature: this.global.Kiln.thermoSensor.average,
            thermo_sensor_error: this.global.Kiln.thermoSensorError,
            is_firing: this.global.Kiln.isFiring,
            firing_life_cycle: this.global.Kiln.firingLifeCycle,
            firing_error: this.global.Kiln.firingError,
            ramp_index: this.global.Kiln.rampIndex,
            is_holding: this.global.Kiln.isHolding,
            schedule_id: this.global.Kiln.scheduleId,
        })
    }

    emitRealtimeData(){
        this.global.socket.emit("update-realtime-data", this.getRealtimeData())
        this.global.io.emit("update-realtime-data", this.getRealtimeData())
    }

    componentWillMount(){
        this.globalChanged.on("Authentication.socketIsAuthenticated", (socketIsAuthenticated)=>{
            if (socketIsAuthenticated){
                this.emitRealtimeData()
            }
        })
    }

    componentDidMount(){
        this.emitRealtimeData()
        this.interval = setInterval(()=>{
            this.emitRealtimeData()
        }, (process.env.REALTIME_DATA_UPDATE_INTERVAL_SECONDS || 5) * 1000)
    }
}