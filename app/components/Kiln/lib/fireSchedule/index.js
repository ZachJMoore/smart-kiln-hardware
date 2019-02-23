const isDebug = process.env.DEBUG === "true"

module.exports = function* (){

    if (!this.state.schedule){
        this.errorFiring("No schedule provided")
        return
    }

    const ramps = this.state.schedule.firing_schedule_ramps.slice()

    if (isDebug) console.log(ramps)

    this.PID.setTarget(this.state.thermoSensor.average + 0)

    for(let e = 0; e < ramps.length; e++){

        let tick = 5;

        let ramp = ramps[e]

        ramp = {
            rate: ramp.ramp_rate,
            target: ramp.target_temperature,
            hold: ramp.hold_minutes,
        }

        let isDownRamp = false
        let difference = ramp.target - this.state.thermoSensor.average

        if (Math.sign(difference) === -1){
            isDownRamp = true;
            difference = Math.abs(difference)
        }

        let hoursNeeded = difference / ramp.rate;
        let secondsNeeded = hoursNeeded * 60 * 60;
        let risePerSecond = (difference / secondsNeeded)*tick;

        if (isDownRamp){
            risePerSecond = -risePerSecond
        }

        if (isDebug){
            console.log({
                ramp: e+1,
                difference,
                hoursNeeded,
                secondsNeeded,
                currentTemperature: this.state.thermoSensor.average,
                rampTarget: ramp.target,
                risePerSecond
            })
        }

        this._firing_schedule_increase_interval = setInterval(()=>{

            // TODO: Make sure that the elements do not heat to quickly and start the hold or next ramp if the PID target value has not reached the ramp target yet.
            // TODO: Set a timer how long the ramp should take to reach peak. Ensure we don't move into the hold -> next ramp
            if (!isDownRamp){

                if (this.state.thermoSensor.average < ramp.target){
                    if (this.global.Kiln.PID.target < ramp.target){
                        this.PID.increaseTarget(risePerSecond)
                    } else {
                        this.PID.setTarget(ramp.target)
                    }
                } else {
                    clearInterval(this._firing_schedule_increase_interval)
                    this.PID.setTarget(ramp.target)

                    if (isDebug) console.log(`entering hold for ${ramp.hold*60} minutes`)
                    this._firing_schedule_hold_timeout = setTimeout(()=>{

                        if (this._fire_schedule_instance.next().done){
                            this.finishFiring()
                       }

                    },(ramp.hold*60*1000))
                }

            } else {

                if (this.state.thermoSensor.average > ramp.target){
                    if (this.PID.target > ramp.target){
                        this.PID.increaseTarget(risePerSecond)
                    } else {
                        this.PID.setTarget(ramp.target)
                    }
                } else {
                    clearInterval(this._firing_schedule_increase_interval)
                    this.PID.setTarget(ramp.target)

                    if (isDebug) console.log(`entering hold for ${ramp.hold*60} minutes`)
                    this._firing_schedule_hold_timeout = setTimeout(()=>{

                        if (this._fire_schedule_instance.next().done){
                            this.finishFiring()
                       }

                    },(ramp.hold*60*1000))
                }

            }

        }, tick*1000)

        yield
    }
}