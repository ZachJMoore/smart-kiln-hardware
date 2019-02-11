import React, { setGlobal } from 'reactn';
import ReactDOM from 'react-dom';
import "./fonts/roboto/stylesheet.css"
import "./icons/material/material-icons.css"
import './scss/index.scss';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import * as serviceWorker from './serviceWorker';
import getTemperatureText from './lib/getTemperatureText';

setGlobal({
    currentTime: "0:00 am",
    isFahrenheit: true,
    current_temperature: 0,
    temperatureText: getTemperatureText(0, true),
    current_temperature_datapoints: [],
    sidebarIsShown: false,
    firing_schedules: [],
})

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
