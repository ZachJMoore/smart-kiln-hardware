import React, { Component } from "reactn"
import styles from "./index.module.scss"
import ScheduleLink from "./ScheduleLink"

class FiringSchedules extends Component{
    render(){
        return <>
            <div className={styles.scheduleContainer}>
                {this.global.firingSchedules.map((schedule, index)=><ScheduleLink firingSchedule={schedule} key={index} />)}
            </div>
        </>
    }
}

export default FiringSchedules