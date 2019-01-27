import React from "react"
import Plot from "react-plotly.js"
import "../scss/plotly.scss"

let unpack = (array, key) => {
    if (array.length === 0) return []
    return array.map(datapoint => datapoint[key])
}

const Chart = ({datapoints = [{temperature: 75, created_at: 1548532307617}, {temperature: 95, created_at: 1548532307717}], firingScheduleRamps = [], temperature_display_type = "fahrenheit"}) => (
    <Plot
        data={[
            {
                type: "scatter",
                mode: "lines",
                name: 'Temp',
                x: unpack(datapoints, "created_at"),
                y: unpack(datapoints, "temperature"),
                line: { color: '#5C5C5C' }
            }
        ]}
        layout={{
            font: {
                family: "Roboto",
            },
            xaxis: {
                autorange: true,
                rangeselector: {
                    buttons: [
                        { step: 'all' },
                        {
                            count: 12,
                            label: '12h',
                            step: 'hour',
                            stepmode: "backward"
                        },
                        {
                            count: 6,
                            label: '6h',
                            step: 'hour',
                            stepmode: 'backward'
                        },
                        {
                            count: 1,
                            label: '1h',
                            step: 'hour',
                            stepmode: 'backward'
                        },
                        {
                            count: 30,
                            label: '30m',
                            step: 'minute',
                            stepmode: 'backward'
                        }
                    ]
                },
                type: 'date'

            },
            yaxis: {
                autorange: true,
                type: 'linear'
            },
            plot_bgcolor: "#0000",
            paper_bgcolor: '#0000',
            margin: {
                l: 40,
                r: 25,
                b: 70,
                t: 5
            },
            dragmode: "pan",
            showlegend: false
        }}

        config={{ 
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ["toImage", "autoScale2d", "toggleSpikelines", "hoverClosestCartesian", "hoverCompareCartesian"],
            scrollZoom: true,
            responsive: true,
            setBackground: "#0000" }}

        useResizeHandler={true}
    />
)

export default Chart