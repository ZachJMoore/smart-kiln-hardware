import React from "react"
import { HomeChart } from "../Charts"
import styles from "./index.module.scss"

let Home = (props)=>(
    <>
        <div className={styles["chart-container"]}>
            <HomeChart datapoints={props.datapoints} isFahrenheit={props.isFahrenheit}/>
        </div>
        <div className={styles["current-status-container"]}>
            <ul>
            <li>current_temperature: {props.temperatureText}</li>
            </ul>
        </div>
    </>
)

export default Home