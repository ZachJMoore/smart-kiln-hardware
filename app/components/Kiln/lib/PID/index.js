const { Components } = require("passeljs")
const helpers = require("../../../../lib/helpers.js")

const isDebug = process.env.DEBUG === "true"

module.exports = class PID extends Components.Base {
    constructor(props) {
        super(props)

        this.componentName="PID"

        this.state = {
            target: 0,
        }

        this.interval = null

        this.options = {
            globalState:{
                options: {
                    include:[
                        {
                            key: "target",
                            emit: false
                        }
                    ]
                }
            }
        }

        this.holdTarget = this.holdTarget.bind(this)

    }

    holdTarget(){
        const temperatureOffset = 0

        let tf = helpers.resolveObjectPath("Authentication.account.kiln_settings.temperature_offset", this.global)

        if (tf && typeof tf === "number") temperatureOffset = tf

        if ((this.parentState.thermoSensor.average - temperatureOffset) >= this.state.target) {
            this.props.setRelays(0)
        }

        if ((this.parentState.thermoSensor.average - temperatureOffset) < this.state.target) {
            this.props.setRelays(1)
        }

        if (isDebug) console.log("Temperature: ", this.parentState.thermoSensor.average, "Target: ", this.state.target)
    }

    setTarget(target){
        this.setState({target: target+0})
    }

    increaseTarget(increase){
        this.setState({target: this.state.target + increase})
    }

    startPID(){
        clearInterval(this.interval)
        this.holdTarget()
        this.interval = setInterval(this.holdTarget, 5000)
    }

    stopPID(){
        clearInterval(this.interval)
        this.setState({
            target: 0
        })
    }

    componentWillMount(){
        this.parentStateChanged.on("isFiring", (isFiring)=>{
            if (isFiring){
                this.startPID()
            } else {
                this.stopPID()
            }
        })
    }

    componentDidMount(){
        // make sure all the relays are off.
        this.props.setRelays(0)
    }
}