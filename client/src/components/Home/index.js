import React, { Component } from "reactn"
import { HomeChart } from "../Charts"
import styles from "./index.module.scss"
import { Button } from "@material-ui/core";

export default class Home extends Component{

    stopFiringSchedule = ()=>{
        this.global.socket.emit("stop-firing-schedule", (error)=>{
          if (error){
            alert(new Error(error))
          }
        })
    }

    render(){
        return (<>
            <div className={styles["chart-container"]}>
                <HomeChart datapoints={this.global.current_temperature_datapoints}/>
            </div>
            <div className={styles["current-status-container"]}>
                {/* TODO: add information about what is currently happening */}
                {/* Add a way to stop a firing schedule in progress */}
                <ul>
                <li>current_temperature: {this.global.temperatureText}</li>
                </ul>
                <Button onClick={this.stopFiringSchedule} disabled={!this.global.kilnState.is_firing}>Stop Firing</Button>
            </div>
        </>)
    }
}