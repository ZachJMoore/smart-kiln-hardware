import React, { Component } from "react"
import styles from "./index.module.scss"
import ScheduleLink from "./ScheduleLink"

class FiringSchedules extends Component{
    render(){
        return <>
            <div className={styles.scheduleContainer}>
                {this.props.firingSchedules.map((schedule, index)=><ScheduleLink firingSchedule={schedule} isFahrenheit={this.props.isFahrenheit} key={index} />)}
            </div>
        </>
    }
}

export default FiringSchedules