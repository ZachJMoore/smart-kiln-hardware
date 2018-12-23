import React, { Component } from "react"
import Chart from "chart.js"

class Graph extends Component{
    constructor(props){
        super(props);
        this.initChart = (data, labels)=>{
            this.chart = new Chart(this.refs.ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        fill: true,
                        borderColor: "#0c0c0c",
                        backgroundColor: "#0001"
                    }]
                },
                options: {
                    animation: {
                        duration: 0
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: "Graph",
                        fontSize: 16,
                        fontColor: "#f0eeea"
                    },
                    responsive: true,
                    tooltips: {
                        mode: "index",
                        intersect: false,
                        displayColors: false
                    },
                    hover: {
                        mode: "nearest",
                        intersect: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                            }
                        }]
                    }
                }
            });
        }
    }

    componentDidMount(){
        let data = this.props.data.slice().reverse()
        let labels = data.map((temp, index)=>{
            return `${((index*1)+1)}m`
        }).reverse()
        this.initChart(data, labels)
    }
    componentDidUpdate(){
        let data = this.props.data.slice().reverse()
        let labels = data.map((temp, index)=>{
            return `${(index+1)}m`
        }).reverse()

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data
        this.chart.update();
    }
    render(){
        return (
            <div className="graph-container">
                <canvas ref="ctx" className="graph-canvas"></canvas>
            </div>
        )
    }
}

export default Graph