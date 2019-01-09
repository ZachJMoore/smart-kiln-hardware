import React from "react"

let ScheduleItem = (props) => (
    <div className="schedule-item">
        <p>{props.schedule.name}</p>
        <table>
            <tbody>
                <tr>
                    <th>Ramp</th>
                    <th>Rate</th>
                    <th>Target</th>
                    <th>Hold</th>
                </tr>
                {props.schedule.firing_schedule_ramps.map((ramp, index)=>
                    (<tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ramp.ramp_rate}</td>
                        <td>{ramp.target_temperature}</td>
                        <td>{ramp.hold_minutes}</td>
                    </tr>)
                )}
            </tbody>

        </table>
    </div>
)

export default ScheduleItem