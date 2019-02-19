import React, { Component } from "reactn"
import { Line } from "react-chartjs-2" // Must be imported for zoom to work
import Button from "@material-ui/core/Button"
import styles from "./index.module.scss"
import convertSchedule from "../../../lib/charting/convertSchedule"
import getTemperature from "../../../lib/getTemperature";
import splitDatapoints from "../../../lib/charting/splitDatapoints";

class HomeChart extends Component {

    state = {
        timeScale: 0
    }

    timeScales = [
        {
            text: "1H",
            type: "hour",
            step: 1
        },
        {
            text: "3H",
            type: "hour",
            step: 3
        },
        {
            text: "6H",
            type: "hour",
            step: 6
        },
        {
            text: "12H",
            type: "hour",
            step: 12
        },
        {
            text: "24H",
            type: "hour",
            step: 24
        }
    ]

    setTimeScale = (scale)=>{
        let multiplier = 0

        if (scale.type === "hour"){
            multiplier = 60*60*1000
        }

        // if (other type e.g. day, month){ set multiplier}

        let timeScale = scale.step*multiplier

        this.setState({timeScale})
    }

    getTimeScale = (minMax)=>{

        let isMin = true

        if (minMax === "max"){
            isMin = false
        }


        if (this.global.kilnState.is_firing){
            let datapoints = this.global.firing_schedule_log_datapoints
            if (datapoints && datapoints.length > 0){
                if (isMin)
                return datapoints[datapoints.length -1].created_at - (this.state.timeScale/2)
                else return datapoints[datapoints.length -1].created_at + (this.state.timeScale/2)
            } else if (this.global.kilnLog){
                if (isMin)
                return this.global.kilnLog.created_at - (this.state.timeScale/2)
                else return this.global.kilnLog.created_at + (this.state.timeScale/2)
            } else return 0
        } else {
            let datapoints = this.props.datapoints
            if (datapoints && datapoints.length > 0){
                if (isMin)
                return datapoints[datapoints.length -1].created_at - this.state.timeScale
                else return 0
            } else return 0
        }
    }

    unpackDatapoints = () => {
        let datapoints = null;
        let rt = []

        if (!this.props.datapoints && !this.global.firing_schedule_log_datapoints) return rt
        else {
            if (this.global.kilnState.is_firing && this.global.firing_schedule_log_datapoints) datapoints = this.global.firing_schedule_log_datapoints
            else datapoints = this.props.datapoints
        }

        datapoints = splitDatapoints(datapoints)

        rt = datapoints.map(datapoint => {
            if (datapoint === null) return null

            let x = datapoint.created_at

            let y = datapoint.temperature

            y = getTemperature(y, this.global.isFahrenheit)
            return { x: x, y: y }
        })

        return rt
    }

    unpackSchedule = ()=>{

        let rt = []
        if (!this.global.kilnState.is_firing || !this.global.currentSchedule || !this.global.kilnLog) return rt
        rt = convertSchedule(this.global.currentSchedule.firing_schedule_ramps, {
            start: {
                y: this.global.kilnLog.starting_fahrenheit_temperature,
                x: this.global.kilnLog.created_at
            },
            isFahrenheit: this.global.isFahrenheit
        })

        return rt
    }

    componentDidMount(){
        this.setTimeScale(this.timeScales[0])
    }

    componentWillUnmount(){
        this.chartReference.chartInstance.destroy()
    }

    render() {

        // console.log("Datapoints: ", this.unpackDatapoints())
        // console.log("Firing Schedule: ", this.unpackSchedule())

        return (
            <div className={styles["chart-container"]}>
                <div className={styles.chart}>
                    <Line
                        ref={ref=>this.chartReference = ref}
                        data={{
                            datasets: [{
                                label: "Temperature",
                                data: this.unpackDatapoints(),
                                pointRadius: 2,
                                borderColor: "#5C5C5C",
                                spanGaps: false
                            },
                            {
                                label: "Schedule",
                                data: this.unpackSchedule(),
                                pointRadius: 2,
                                borderColor: "#2c555f",
                                backgroundColor: "#5baec119"
                            }]
                        }}
                        options={{
                            tooltips: {
                                bodySpacing: 4,
                                xPadding: 12,
                                mode: "nearest",
                                intersect: 0,
                                position: "nearest"
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        fontColor: "#5C5C5C"
                                    }
                                }],
                                xAxes: [{
                                    type: 'time',
                                    time: {
                                        min: this.getTimeScale("min"),
                                        max: this.getTimeScale("max")
                                    },
                                    ticks: {
                                        fontColor: "#5C5C5C",
                                        autoSkip: false,
                                        maxRotation: 0,
                                    }
                                }]
                            },
                            animation: {
                                duration: 300
                            },
                            elements: {
                                line: {
                                    spanGaps: false,
                                    tension: 0
                                }
                            },
                            legend: {
                                display: false
                            },
                            responsive: true,
                            hover: {
                                mode: "nearest",
                                intersect: true
                            },
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0
                                }
                            }
                        }}
                    />
                </div>
                <div className={styles["chart-controls-container"]}>
                    {this.timeScales.map((scale, index)=>{
                        return <Button onClick={() => { this.setTimeScale(scale) }} key={index}>{scale.text}</Button>
                    })}
                </div>
            </div>
        )
    }
}

export default HomeChart