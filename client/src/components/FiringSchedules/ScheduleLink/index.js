import React from "react"
import { ScheduleThumbnail } from "../../Charts"
import * as styles from "./index.module.scss"
import { Card, CardActionArea, CardMedia, CardContent } from "@material-ui/core"
import { Link, withRouter } from "react-router-dom"

const ActionLink = (props)=>(
    <Link to={props.to}>
        <ScheduleThumbnail scheduleRamps={props.scheduleRamps} isFahrenheit={props.isFahrenheit} />
    </Link>
)

const ScheduleLink = (props) => {

    let getCone = (nb)=>{
        if (`${nb}`.includes("-")){
            return `0${Math.abs(nb)}`
        } else {
            return `${nb}`
        }
    }

    return (
        <Card className={styles.card}>
            <CardActionArea>
                <CardMedia
                    className={styles.scheduleChart}
                    src="schedule chart"
                    component={() => <ActionLink to={`${props.location.pathname}/${props.firingSchedule.id}`} scheduleRamps={props.firingSchedule.firing_schedule_ramps} isFahrenheit={props.isFahrenheit} />}
                />
            </CardActionArea>
            <CardContent>
                <div className={styles.content}>
                    <h4>{props.firingSchedule.name}</h4>
                    <h5>{getCone(props.firingSchedule.cone)}</h5>
                </div>
            </CardContent>
        </Card>
    );
}

export default withRouter(ScheduleLink)