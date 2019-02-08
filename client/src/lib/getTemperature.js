const getTemperature = (temperature, isFahrenheit)=>{

    let t = temperature

    if (isFahrenheit === false) {
        t = (temperature - 32) * (5 / 9)
    }

    t = parseInt(t.toFixed(2))

    return t
}

export default getTemperature