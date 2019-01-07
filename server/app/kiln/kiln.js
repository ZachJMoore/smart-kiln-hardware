const fs = require("fs")

let max31855, thermoSensor;

if (process.env.FAKE_DATA === "false"){
    max31855 = require('../lib/max31855');
    thermoSensor = new max31855();
}

ROOT_APP_PATH = fs.realpathSync('.');
console.log(`Root App File Path: ${ROOT_APP_PATH}`);

class PID {
    constructor(kiln, temperatureOffset) {
        this.target = 0
        this.kiln = kiln
        this.temperatureOffset = temperatureOffset || 0
        this.debug = kiln.debug || false
        this.PIDInterval

        this.holdTarget = () => {
            clearInterval(this.PIDInterval)
            this.PIDInterval = setInterval(() => {

                if ((this.kiln.temperature - this.temperatureOffset) >= this.target && this.kiln.checkRelays() === true) {
                    this.kiln.setRelays(0)
                    this.debug && console.log("relay set off")
                }

                if ((this.kiln.temperature - this.temperatureOffset) < this.target && this.kiln.checkRelays() === false) {
                    this.kiln.setRelays(1)
                    this.debug && console.log("relay set on")
                }

                this.debug && console.log("Temperature: ", this.kiln.temperature, "Target: ", this.target)

            }, 1000)
        }

        this.setTarget = (target) => {
            this.target = target
        }

        this.increaseTarget = (increase) => {
            this.target = this.target + increase
        }

        this.startPID = () => {
            clearInterval(this.PIDInterval)
            this.holdTarget()
        }

        this.stopPID = () => {
            clearInterval(this.PIDInterval)
            this.kiln.setRelays(0)
        }

    }
}


// Kiln Class Constructor Object example

// {
//     relays: [onOffGPIO],
//     debug: false,
//     config: config
// }

class Kiln {
    constructor(object) {
        this.temperature = 0
        this.isFiring = false
        this.estimated_minutes_remaining = 0
        this.currentSchedule = {}
        this.temperatureLog = []
        this.controller = null
        this.relays = object.relays
        this.startupDate = Date.now()
        this.config = object.config
        if (this.config.kiln_settings) this.temperature_offset = this.config.kiln_settings.temperature_offset || 0
        else this.temperature_offset = 0
        this.debug = object.debug
        this.kiln_log = {}

        this.getTemperature = () => {
            return new Promise((resolve, reject) => {
                if (process.env.FAKE_DATA === "false"){
                    thermoSensor.readTempC((temperature) => {
                        //if invalid reading, reject
                        if (isNaN(temperature)) {
                            reject("thermocouple may be broken or not attached");
                        } else {
                            //else, resolve temperature converted to fahrenheit
                            let temperatureF = parseFloat(((temperature * 1.8) + 32).toFixed(2))
                            resolve(temperatureF)
                        }
                    })
                } else {
                    if ((Math.random()*10).toFixed(0) % 2){
                        resolve(80+1)
                    } else {
                        resolve(80+2)
                    }
                }
            })
        }

        this.getPackage = () => {
            return {
                temperature: this.temperature,
                isFiring: this.isFiring,
                currentSchedule: this.currentSchedule,
                temperatureLog: this.temperatureLog,
                estimated_minutes_remaining: this.estimated_minutes_remaining
            }
        }

        this.setRelays = (value) => {

            value === 1 ? value = 1 : value = 0

            this.relays.forEach(relay => {
                relay.writeSync(value)
            })
        }

        this.checkRelays = () => {

            let isOn = false

            this.relays.forEach(relay => {
                if (relay.readSync() === 1){
                    isOn = true
                }
            })

            return isOn
        }

        this.startFiring = (firing_schedule) => {

            if (!this.isFiring){

                console.log(firing_schedule)

                this.isFiring = true
                this.currentSchedule = firing_schedule
                this.fireScheduleInstance = this.fireSchedule(firing_schedule)
                this.fireScheduleInstance.next()

                let schedule_id = null
                if (firing_schedule.id) schedule_id = firing_schedule.id
                this.sync.startLog(schedule_id)

            }

        }

        this.stopFiring = ()=>{
            this.isFiring = false
            this.controller.stopPID()
            this.sync.endLog()
        }

        this.fireSchedule = function* (schedule){
            if (!schedule){
                this.stopFiring()
                return
            }

            this.controller.setTarget(this.temperature)
            this.controller.startPID()

            let endFiring = () => {
                clearInterval(this.increaseInterval)
                clearInterval(this.firingScheduleCheckInterval)
                clearTimeout(this.holdTimeout)
                this.controller.stopPID()
                this.stopFiring()
            }

            console.log(schedule.ramps)

            for(let e = 0; e < schedule.ramps.length; e++){

                let ramp = schedule.ramps[e]

                ramp = {
                    rate: parseFloat(ramp.rate),
                    target: parseFloat(ramp.target),
                    hold: parseFloat(ramp.hold),
                }

                let isDownRamp = false
                let difference = ramp.target - this.temperature

                if (Math.sign(difference) === -1){
                    isDownRamp = true;
                    difference = Math.abs(difference)
                }

                let hoursNeeded = difference / ramp.rate;
                let secondsNeeded = hoursNeeded * 60 * 60;
                let risePerSecond = difference / secondsNeeded;

                if (isDownRamp){
                    risePerSecond = -risePerSecond
                }

                if (this.debug){
                    console.log("Entering ramp: ", e+1)
                    console.log("Current Temperature: ", this.temperature)
                    console.log("Target Temperature: ", ramp.target)
                    console.log("Rise Per Second: ", risePerSecond)
                }

                this.increaseInterval = setInterval(()=>{

                    // TODO: Make sure that the elements do not heat to quickly and start the hold or next ramp if the PID target value has not reached the ramp target yet.

                    if (!isDownRamp){

                        if (this.temperature < ramp.target){
                            if (this.controller.target < ramp.target){
                                this.controller.increaseTarget(risePerSecond)
                            } else {
                                this.controller.setTarget(ramp.target)
                            }
                        } else {
                            clearInterval(this.increaseInterval)
                            this.controller.setTarget(ramp.target)

                            this.debug && console.log(`entering hold for ${ramp.hold*60} minutes`)
                            this.holdTimeout = setTimeout(()=>{

                                if (this.fireScheduleInstance.next().done){
                                    endFiring()
                                    this.debug && console.log("Firing Completed")
                               }

                            },(ramp.hold*60*60*1000))
                        }

                    } else {

                        if (this.temperature > ramp.target){
                            if (this.controller.target > ramp.target){
                                this.controller.increaseTarget(risePerSecond)
                            } else {
                                this.controller.setTarget(ramp.target)
                            }
                        } else {
                            clearInterval(this.increaseInterval)
                            this.controller.setTarget(ramp.target)

                            this.debug && console.log(`entering hold for ${ramp.hold*60} minutes`)
                            this.holdTimeout = setTimeout(()=>{

                                if (this.fireScheduleInstance.next().done){
                                    endFiring()
                                    this.debug && console.log("Firing Completed")
                               }

                            },(ramp.hold*60*60*1000))
                        }

                    }

                }, 1000)

                clearInterval(this.firingScheduleCheckInterval)
                this.firingScheduleCheckInterval = setInterval(()=>{

                    if (this.isFiring === false){
                        endFiring()
                    }

                }, 2000)

                yield
            }
        }

        this.init = () => {
            this.setRelays(0) //set all relays off
            this.controller = new PID(this, this.temperature_offset)

            this.getTemperature()
            .then(temperature => {
                this.temperature = temperature
            })
            .catch(console.log)

            setInterval(() => {

                this.getTemperature()
                    .then(temperature => {
                        this.temperature = temperature
                    })
                    .catch(console.log)

            }, 1000)

            setTimeout(() => {
                this.temperatureLog.push(this.temperature)
            }, 2000)

            setInterval(() => {
                if (this.temperatureLog.length < 60) {
                    this.temperatureLog.unshift(this.temperature)
                } else {
                    this.temperatureLog.unshift(this.temperature)
                    this.temperatureLog.pop()
                }
            }, 60000)

            this.sync = require("../syncing/sync.js")
        }
    }
}

const config = require("../syncing/lib/fsSync.js").getKilnData()

let kiln;
let isFakeData = process.env.FAKE_DATA === "true"
let isDebug = process.env.DEBUG === "true"

if (!isFakeData){
    const Gpio = require('onoff').Gpio;
    const relayOne = new Gpio(27, 'out');

    kiln = new Kiln({
        relays: [relayOne],
        debug: isDebug,
        config: config
    })
} else {
    kiln = new Kiln({
        relays: [],
        debug: isDebug,
        config: config
    })
}

module.exports = kiln