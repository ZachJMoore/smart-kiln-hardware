import getTemperature from "../getTemperature";

const convertSchedule = (scheduleRamps, props) => {
    if (!scheduleRamps || scheduleRamps.length === 0) return []

    let start;

    if (props.start){
        start = props.start
        start.y = getTemperature(start.y, props.isFahrenheit)
    } else {
        start = {x: Date.now(), y: getTemperature(50, props.isFahrenheit)}
    }

    let date = start.x

    let datapoints = []

    scheduleRamps.forEach((ramp, index)=>{
        let x = ramp.ramp_rate // rate

        let y = ramp.target_temperature // target

        let difference
        if (index === 0){
            difference = y - start.y
        } else {
            difference = y - scheduleRamps[index-1]["target_temperature"]
        }

        if (Math.sign(difference) === -1){
            difference = Math.abs(difference)
        }

        let hoursNeeded = difference / x;
        let millisecondsNeeded = hoursNeeded * 60 * 60 * 1000;

        x = date + millisecondsNeeded
        date += millisecondsNeeded

        y = getTemperature(y, props.isFahrenheit)

        datapoints.push({ x: x, y: y })

        if (ramp.hold_minutes > 0){
            let millisecondsNeeded = ramp.hold_minutes * 60 * 1000
            x = date + millisecondsNeeded
            date += millisecondsNeeded
            datapoints.push({x: x, y: y})
        }
    })
    
    return [start, ...datapoints]

}

export default convertSchedule