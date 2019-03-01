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
                        return new Promise((resolve, reject)=>{
                            if ((Math.random()*10).toFixed(0) % 2){
                                resolve(26+1)
                            } else {
                                resolve(26+2)
                            }
                        })
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

    async readCelsiusAsync(){
        return new Promise((resolve, reject)=>{
            Promise.all(
              this.sensors.map((sensor)=>{
                return sensor.readTempC()
              })
            ).then((temperatures)=>{
                let hasValidReading = false
                let hasValidReadingCount = 0
                let average = 0
                let sensors = []
                temperatures.map(temperature=>{
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
                if (!hasValidReading) return reject(new Error("No valid readings from thermocouple(s)"))
                else return resolve({
                    hasValidReading,
                    hasValidReadingCount,
                    average: average / hasValidReadingCount,
                    sensors
                })
            })

          })
    }

    async readFahrenheitAsync(){
        return this.readCelsiusAsync().then((status)=>{
            status.average = helpers.celsiusToFahrenheit(status.average),
            status.sensors = status.sensors.map(object => {
                object.temperature = helpers.celsiusToFahrenheit(object.temperature);
                return object;
            });
            return Promise.resolve(status)
        })
    }
}