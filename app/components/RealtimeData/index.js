const { Components } = require("passeljs")

module.exports = class RealtimeData extends Components.Base{
    constructor(props){
        super(props)
    }

    getRealtimeData(){
        return ({
            average_temperature: this.global.Kiln.thermoSensor.average,
            has_valid_thermocouple_reading: this.global.Kiln.thermoSensor.hasValidReading,
            has_valid_thermocouple_reading_count: this.global.Kiln.thermoSensor.hasValidReadingCount,
            thermocouple_sensor_error: this.global.Kiln.thermoSensorError ? this.global.Kiln.thermoSensorError.message : null,
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