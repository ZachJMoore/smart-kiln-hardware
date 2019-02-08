import React, { Component } from "reactn"
import { ScheduleThumbnail } from "../../Charts"
import * as styles from "./index.module.scss"
import { Card, CardActionArea, CardMedia, CardContent } from "@material-ui/core"
import { Link, withRouter } from "react-router-dom"
import getCone from "../../../lib/getCone";

const ActionLink = (props)=>(
    <Link to={props.to}>
        <ScheduleThumbnail scheduleRamps={props.scheduleRamps} isFahrenheit={props.isFahrenheit} />
    </Link>
)

class ScheduleLink extends Component{

    render(){

        return (
            <Card className={styles.card}>
                <CardActionArea>
                    <CardMedia
                        className={styles.scheduleChart}
                        src="schedule chart"
                        component={() => <ActionLink to={`${this.props.location.pathname}/${this.props.firingSchedule.id}`} scheduleRamps={this.props.firingSchedule.firing_schedule_ramps} isFahrenheit={this.global.isFahrenheit} />}
                    />
                </CardActionArea>
                <CardContent>
                    <div className={styles.content}>
                        <h4>{this.props.firingSchedule.name}</h4>
                        <h5>{getCone(this.props.firingSchedule.cone)}</h5>
                    </div>
                </CardContent>
            </Card>
        );

    }
}

export default withRouter(ScheduleLink)