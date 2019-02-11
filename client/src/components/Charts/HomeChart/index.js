import React, { Component } from "reactn"
import { Line } from "react-chartjs-2" // Must be imported for zoom to work
import Button from "@material-ui/core/Button"
import styles from "./index.module.scss"
import convertSchedule from "../../../lib/charting/convertSchedule"
import getTemperature from "../../../lib/getTemperature";
import splitDatapoints from "../../../lib/splitDatapoints";

class HomeChart extends Component {

    state = {
        datapoints: [],
        scheduleDatapoints: [],
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

    getTimeScale = ()=>{
        if (!this.props.datapoints || this.props.datapoints.length === 0) return []
        else return this.props.datapoints[this.props.datapoints.length -1].created_at - this.state.timeScale
    }

    unpackDatapoints = () => {
        let datapoints = null;

        if (!this.props.datapoints || this.props.datapoints.length === 0) return []
        else datapoints = this.props.datapoints

        datapoints = splitDatapoints(datapoints)

        let rt = datapoints.map(datapoint => {
            if (datapoint === null) return null

            let x = datapoint.created_at

            let y = datapoint.temperature

            y = getTemperature(y, this.global.isFahrenheit)
            return { x: x, y: y }
        })
        return rt
    }

    unpackSchedule = ()=>{
        return []
        //TODO: add schedule conversion and context based on if a schedule is being fired
        //TODO: Make sure that convertSchedule is passed a start object with the starting date of a firing schedule log and the starting temp
        //TODO: hide all datapoints and start fresh datapoints in correlation to the schedule
    }

    componentDidMount(){
        this.setTimeScale(this.timeScales[0])
    }

    componentWillUnmount(){
        this.chartReference.chartInstance.destroy()
    }

    render() {

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
                                borderColor: "#5C5C5C"
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
                                        min: this.getTimeScale()
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
                                    spanGaps: false
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