import React, { setGlobal } from 'reactn';
import ReactDOM from 'react-dom';
import "./fonts/roboto/stylesheet.css"
import "./icons/material/material-icons.css"
import './scss/index.scss';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import * as serviceWorker from './serviceWorker';
import getTemperatureText from './lib/getTemperatureText';

let constructDateString = (minutes, hours)=>{

    let isPm = false

    if (hours > 12){
        hours = hours - 12
        isPm = true
    }

    if (minutes < 10){
        minutes = `0${minutes}`
    }

    return `${hours}:${minutes} ${isPm ? "pm":"am"}`
}

let getCurrentTimeString = () => {
    let date = new Date()
    let minutes = date.getMinutes()
    let hours = date.getHours()

    return constructDateString(minutes, hours)

}

setGlobal({
    currentTimeString: getCurrentTimeString(),
    isFahrenheit: true,
    current_temperature: 0,
    temperatureText: getTemperatureText(0, true),
    current_temperature_datapoints: [],
    firing_schedule_log_datapoints: [],
    currentSchedule: null,
    sidebarIsShown: false,
    firing_schedules: [],
    kilnState: {
        is_firing: false
    },
    kilnLog: null,
    socket: {
        emit: ()=>{},
        on: ()=>{},
    }
})

let clockOffset = 60 - (new Date()).getSeconds()
setTimeout(()=>{

    setGlobal({currentTimeString: getCurrentTimeString()})

    setInterval(()=>{
        setGlobal({currentTimeString: getCurrentTimeString()})
    }, 60*1000)

}, clockOffset*1000)


ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
