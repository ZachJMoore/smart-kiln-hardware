import React, { Component } from "reactn"
import { Line, Chart } from "react-chartjs-2"
import * as zoom from 'chartjs-plugin-zoom' // Must be imported for zoom to work
import Button from "@material-ui/core/Button"
import styles from "./index.module.scss"
import convertSchedule from "../../../lib/charting/convertSchedule"
import getTemperature from "../../../lib/getTemperature";
import splitDatapoints from "../../../lib/splitDatapoints";

class HomeChart extends Component {

    state = {
        isInteractive: false,
        datapoints: [],
        scheduleDatapoints: [],
        min: 0
    }

    minCycle = 1;

    toggleMin(){
        let min

        if (this.minCycle === 0){
            min = 0
            this.minCycle++
        } else if (this.minCycle === 1){
            if (this.props.datapoints.length !== 0) min = this.props.datapoints[this.props.datapoints.length-1].created_at - 1*60*60*1000
            this.minCycle++
        } else if (this.minCycle === 2){
            if (this.props.datapoints.length !== 0) min = this.props.datapoints[this.props.datapoints.length-1].created_at - 2*60*60*1000
            this.minCycle++
        } else if (this.minCycle === 3){
            if (this.props.datapoints.length !== 0) min = this.props.datapoints[this.props.datapoints.length-1].created_at - 6*60*60*1000
            this.minCycle++
        } else if (this.minCycle === 4){
            if (this.props.datapoints.length !== 0) min = this.props.datapoints[this.props.datapoints.length-1].created_at - 12*60*60*1000
            this.minCycle = 0;
        }

        this.setState({min})
    }

    unpackDatapoints = (array, props) => {
        if (!array || array.length === 0) return []
        let rt = array.map(datapoint => {
            if (datapoint === null) return null

            let x = datapoint[props.x]

            let y = datapoint[props.y]

            y = getTemperature(y, this.global.isFahrenheit)
            return { x: x, y: y }
        })
        
        return rt
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
                                borderColor: "#5C5C5C",
                                spanGaps: false
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
                                    time: {
                                        min: this.state.min
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
                    <Button onClick={() => { this.toggleMin() }}>timescale</Button>
                </div>
            </div>
        )
    }
}

export default HomeChart