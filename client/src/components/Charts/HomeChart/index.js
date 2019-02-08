import React, { Component } from "reactn"
import { Line, Chart } from "react-chartjs-2"
import * as zoom from 'chartjs-plugin-zoom' // Must be imported for zoom to work
import Button from "@material-ui/core/Button"
import styles from "./index.module.scss"
import convertSchedule from "../../../lib/charting/convertSchedule"
import getTemperature from "../../../lib/getTemperature";

class HomeChart extends Component {

    state = {
        isInteractive: false
    }

    unpackDatapoints = (array, props) => {
        if (!array || array.length === 0) return []
        return array.map(datapoint => {

            let x = datapoint[props.x]

            let y = datapoint[props.y]

            y = getTemperature(y, this.global.isFahrenheit)
            return { x: x, y: y }
        })
    }

    toggleInteraction = () => {
        this.setState({ isInteractive: !this.state.isInteractive })
    }

    chart = {
        resetZoom: () => { }
    }

    componentWillMount() {
        Chart.plugins.register(zoom)
    }

    componentDidMount() {
        let self = this
        Chart.pluginService.register({
            afterDraw: function (chart, easing) {
                self.chart = chart
            }
        });
    }

    componentWillUnmount(){
        this.chartReference.chartInstance.destroy()
    }

    render() {

        return (
            <div className={styles["chart-container"]}>
                <div className={styles.chart + " " + (!this.state.isInteractive ? styles.isNotInteractive : styles.isInteractive)}>
                    <Line
                        ref={ref=>this.chartReference = ref}
                        data={{
                            datasets: [{
                                label: "Temperature",
                                data: this.unpackDatapoints(this.props.datapoints, { x: "created_at", y: "temperature", isFahrenheit: this.global.isFahrenheit }),
                                pointRadius: 2,
                                borderColor: "#5C5C5C"
                            },
                            {
                                label: "Schedule",
                                data: convertSchedule(this.props.scheduleRamps, { isFahrenheit: this.global.isFahrenheit }), //TODO: Make sure that convertSchedule is passed a start object with the starting date of a firing schedule log and the starting temp
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
                            elements: {
                                line: {
                                    tension: 0
                                }
                            },
                            responsive: true,
                            hover: {
                                mode: "nearest",
                                intersect: true
                            },
                            maintainAspectRatio: false,
                            pan: {
                                enabled: true,
                                mode: 'xy',
                                rangeMin: {
                                    x: null,
                                    y: null
                                },
                                rangeMax: {
                                    x: null,
                                    y: null
                                }
                            },
                            zoom: {
                                enabled: true,
                                mode: 'xy',
                                rangeMin: {
                                    x: null,
                                    y: null
                                },
                                rangeMax: {
                                    x: null,
                                    y: null
                                }
                            },
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
                    <Button onClick={() => { this.chart.resetZoom() }}>reset</Button>
                    <Button onClick={() => { this.toggleInteraction() }}>Toggle Interaction</Button>
                </div>
            </div>
        )
    }
}

export default HomeChart