import React, { Component } from "react"
import { Line, Chart } from "react-chartjs-2"
import * as zoom from 'chartjs-plugin-zoom' // Must be imported for zoom to work
import Button from "@material-ui/core/Button"
import styles from "./index.module.scss"
 
class HomeChart extends Component{

    unpackDatapoints = (array, props) => {
        if (!array || array.length === 0) return []
        return array.map(datapoint => {

            let x = datapoint[props.x]

            let y = datapoint[props.y]

            if (!props.isFahrenheit){
                y = (y - 32)*(5/9)
            }

            y = parseInt(y.toFixed(2))
            return {x: x, y: y}
        })
    }

    unpackScheduleRamps = (array, props) => {
        if (!array || array.length === 0) return []
        return array.map(data => {

            let x = data[props.x]

            let y = data[props.y]

            if (!props.isFahrenheit){
                y = (y - 32)*(5/9)
            }

            //TODO: Set x:date value based on ramp rate

            y = parseInt(y.toFixed(2))
            return {x: x, y: y}
        })
    }

    chart = {
        resetZoom: ()=>{}
    }

    componentDidMount(){
        let self = this
        Chart.pluginService.register({
            afterDraw: function (chart, easing) {
                self.chart = chart
            }
        });
    }

    render(){

        return (
            <div className={styles["chart-container"]}>
                <div className={styles["chart"]}>
                    <Line
                        data={{
                            datasets: [{
                                label: "Temperature",
                                data: this.unpackDatapoints(this.props.datapoints, {x: "created_at", y: "temperature", isFahrenheit: this.props.isFahrenheit}),
                                pointRadius: 2
                            },
                            {
                                label: "Schedule",
                                data: this.unpackScheduleRamps(this.props.scheduleRamps, {x: "ramp_rate", y: "target_temperature", isFahrenheit: this.props.isFahrenheit}),
                                pointRadius: 2
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
                                        beginAtZero:true,
                                        type: "temperature"
                                    }
                                }],
                                xAxes: [{
                                    type: 'time',
                                    ticks:{
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
                            }
                        }}
                    />
                </div>
                <div className={styles["chart-controls-container"]}>
                    <Button onClick={()=>{this.chart.resetZoom()}}>reset</Button>
                </div>
            </div>
        )
    }
}

export default HomeChart