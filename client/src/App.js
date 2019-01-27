import React, { Component } from 'react';
import './scss/App.scss';
import MenuIcon from "@material-ui/icons/Menu"
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Chart from "./components/Chart.js"

class App extends Component {

  state = {
    currentTime: "6:34 pm",
    temperature_display_type: "fahrenheit",
    current_temperature: 1832
  }

  getTemperature = (temperature)=>{
    if (this.state.temperature_display_type !== "fahrenheit") return (temperature - 32)*(5/9)
    else return temperature
  }

  toggleTemperatureDisplayType = ()=>{
    this.setState((prevState)=>{
      if (prevState.temperature_display_type === "fahrenheit") prevState.temperature_display_type = "celcius"
      else prevState.temperature_display_type = "fahrenheit"
      return prevState
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar">
          <IconButton><MenuIcon/></IconButton>
          <div className="info">
            <div className="left">
              <span className="time">{this.state.currentTime}</span>
            </div>
            <div className="right">
              <Button onClick={this.toggleTemperatureDisplayType} className="temperature">{this.getTemperature(this.state.current_temperature)}º{this.state.temperature_display_type.slice(0, 1)}</Button>
            </div>
          </div>
        </nav>
        <nav className="sidebar"></nav>
        <div className="content">
          <div className="content-scroll-container">
            <div className="chart-container">
              <Chart />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
