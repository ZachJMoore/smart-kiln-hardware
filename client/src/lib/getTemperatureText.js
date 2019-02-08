import getTemperature from "./getTemperature"

const getTemperatureText = (temperature, isFahrenheit) =>{

    const t = getTemperature(temperature, isFahrenheit)
    return t + "º" + (isFahrenheit ? "F" : "C")

}

export default getTemperatureText