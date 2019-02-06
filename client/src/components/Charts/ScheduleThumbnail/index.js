import React, { Component } from "react"
import { Line } from "react-chartjs-2"
import styles from "./index.module.scss"
import convertSchedule from "../../../lib/charting/convertSchedule";

class ScheduleThumbnail extends Component {

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
                                data: convertSchedule(this.props.scheduleRamps, { isFahrenheit: this.props.isFahrenheit }),
                                pointRadius: 2,
                                borderColor: "#5C5C5C"
                            }]
                        }}
                        options={{
                            tooltips: {
                                display: false
                            },
                            scales: {
                                yAxes: [{
                                    display: false,
                                    ticks: {
                                        beginAtZero: true,
                                        fontColor: "#5C5C5C"
                                    }
                                }],
                                xAxes: [{
                                    type: 'time',
                                    display: false,
                                    ticks: {
                                        fontColor: "#5C5C5C",
                                        autoSkip: false,
                                        maxRotation: 0,
                                    }
                                }]
                            },
                            animation: {
                                duration: 0
                            },
                            legend: {
                                display: false
                            },
                            elements: {
                                line: {
                                    tension: 0
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            pan: {
                                enabled: false
                            },
                            zoom: {
                                enabled: false
                            },
                            layout: {
                                padding: {
                                    left: 5,
                                    right: 5,
                                    top: 5,
                                    bottom: 0
                                }
                            }
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default ScheduleThumbnail