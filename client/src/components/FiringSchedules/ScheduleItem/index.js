import React, { Component } from "reactn"
import styles from "./index.module.scss"
import ScheduleItemChart from "../../Charts/ScheduleItemChart";
import getTemperature from "../../../lib/getTemperature";
import getCone from "../../../lib/getCone";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core"

class ScheduleItem extends Component{

    render(){
        return (
            <>
                <div className={styles.headerContainer}>
                    <h1 className={styles.scheduleName}>{this.props.schedule.name}</h1>
                    <h2 className={styles.coneTemperature}>{getCone(this.props.schedule.cone)}</h2>
                </div>
                <div className={styles.chartContainer}>
                    <ScheduleItemChart scheduleRamps={this.props.schedule.firing_schedule_ramps} />
                </div>
                <div className={styles.rampTableContainer}>
                    <Table className={styles.rampTable}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ramp</TableCell>
                                <TableCell align="center">Rate</TableCell>
                                <TableCell align="center">Target</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.schedule.firing_schedule_ramps.map((ramp, index)=> (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">{ramp.ramp_index + 1}</TableCell>
                                    <TableCell align="center">{getTemperature(ramp.ramp_rate, this.global.isFahrenheit)}</TableCell>
                                    <TableCell align="center">{getTemperature(ramp.target_temperature, this.global.isFahrenheit)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>
        )
    }
}

export default ScheduleItem