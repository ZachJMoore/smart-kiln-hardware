import React, { Component } from "reactn"
import styles from "./index.module.scss"
import ScheduleLink from "./ScheduleLink"

class FiringSchedules extends Component{
    componentDidMount(){
        this.global.socket.emit("get-firing_schedules")
    }

    render(){
        return <>
            <div className={styles.scheduleContainer}>
                {this.global.firing_schedules.map((schedule, index)=><ScheduleLink firingSchedule={schedule} key={index} />)}
            </div>
        </>
    }
}

export default FiringSchedules