import React, { Component } from "reactn"
import { HomeChart } from "../Charts"
import styles from "./index.module.scss"

export default class Home extends Component{

    render(){

        return (<>
            <div className={styles["chart-container"]}>
                <HomeChart datapoints={this.global.datapoints}/>
            </div>
            <div className={styles["current-status-container"]}>
                <ul>
                <li>current_temperature: {this.global.temperatureText}</li>
                </ul>
            </div>
        </>)

    }
}