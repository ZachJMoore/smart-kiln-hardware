import React, { setGlobal } from 'reactn';
import ReactDOM from 'react-dom';
import "./fonts/roboto/stylesheet.css"
import "./icons/material/material-icons.css"
import './scss/index.scss';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import * as serviceWorker from './serviceWorker';
import firingSchedules from "./firingSchedules"

setGlobal({
    currentTime: "6:34 pm",
    isFahrenheit: true,
    current_temperature: 1832,
    temperatureText: "",
    datapoints: [{ temperature: 5, created_at: 1548532407617 }, { temperature: 10, created_at: 1548532417617 }],
    sidebarIsShown: false,
    firingSchedules: firingSchedules
})

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
