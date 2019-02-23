const Max31855 = require('./lib/Max31855.js');
const helpers = require("../../../../lib/helpers.js")

module.exports = class ThermoSensor{
    constructor(sensorType = "v1", debug = false){

        this.debug = debug
        this.sensorType = sensorType

        let useFakeData = process.env.FAKE_DATA === "true"
        if (useFakeData){

            this.sensors = [
                {
                    readTempC: ()=>{
                        if ((Math.random()*10).toFixed(0) % 2){
                            return (26+1)
                        } else {
                            return (26+2)
                        }
                    }
                }
            ]

        } else {

            if (sensorType === "v1"){
                this.sensors = [
                    new Max31855(this.debug)
                ]
            } else {
                throw new Error("No valid sensor type provided to constructor. No interface library will be loaded")
            }

        }

    }

    readCelsius(){
        let hasValidReading = false
        let hasValidReadingCount = 0
        let average = 0
        let sensors = []
        this.sensors.forEach(sensor=>{
            let temperature = sensor.readTempC(value=>value)
            if (!isNaN(temperature)){
                hasValidReading = true
                hasValidReadingCount++
                average += temperature
                sensors.push({
                    hasValidReading: true,
                    temperature
                })
            } else {
                sensors.push({
                    hasValidReading: false,
                    temperature: null
                })
            }
        })
        if (!hasValidReading) return new Error("No valid readings from thermocouple(s)")
        else return {
            hasValidReading,
            hasValidReadingCount,
            average: average / hasValidReadingCount,
            sensors
        }
    }

    readFahrenheit(){
        let status = this.readCelsius()
        if (helpers.isError(status)) return status
        else {
            status.average = helpers.celsiusToFahrenheit(status.average),
            status.temperatures = status.sensors.map(object=>{
                object.temperature = helpers.celsiusToFahrenheit(object.temperature)
                return object
            })
            return status
        }
    }

    async readCelsiusAsync(){
        return this.readCelsius()
    }

    async readFahrenheitAsync(){
        return this.readFahrenheit()
    }
}