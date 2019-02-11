import React, { Component } from "reactn"
import { Line } from "react-chartjs-2"
import styles from "./index.module.scss"
import convertSchedule from "../../../lib/charting/convertSchedule";

class ScheduleItemChart extends Component {

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
                                data: convertSchedule(this.props.scheduleRamps, { isFahrenheit: this.global.isFahrenheit }),
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
                                    left: 10,
                                    right: 0,
                                    top: 0,
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

export default ScheduleItemChart