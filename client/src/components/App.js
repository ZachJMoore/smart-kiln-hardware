import React, { Component } from 'react';
import {Route, Link} from "react-router-dom"
import Graph from "./Graph"
import Schedules from "./Schedules"
import Controls from "./Controls"


import Kiln from '../lib/kiln';
let kiln = new Kiln()

let refreshPage = () =>{
  window.location.reload();
}

let objectToArray = (object)=>{
  return Object.keys(object).map(key=>{
      return object[key]
  })
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      kiln: {
        temperatureLog: [],
        currentSchedule: {}
      },
      schedules: []
    }

    this.updatePackage = () => {

      kiln.getPackage()
        .then(data=>data.json())
        .then(object => {
          this.setState({kiln: object})
        })
        .catch(console.log)
    }

    this.updateSchedules = () => {

      kiln.getSchedules()
        .then(data=>data.json())
        .then(object => {

          let array = objectToArray(object)
          this.setState({schedules: array})
        })
        .catch(console.log)
    }
  }

  componentDidMount(){
    this.updatePackage()
    this.updateSchedules()

    setInterval(this.updatePackage, 10000)
  }

  render() {
    return <>
      <div className="menu">
        <div className="temperature">{this.state.kiln.temperature}ºF</div>
        <Link className="graph" to="/">Graph</Link>
        <Link className="schedules" to="/schedules">Schedules</Link>
        <Link className="controls" to="/controls">Controls</Link>
        <Link className="settings" to="/settings">Settings</Link>
        <button onClick={refreshPage} className="refresh-button"><svg aria-hidden="true" data-prefix="fas" data-icon="redo" className="" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M500.333 0h-47.411c-6.853 0-12.314 5.729-11.986 12.574l3.966 82.759C399.416 41.899 331.672 8 256.001 8 119.34 8 7.899 119.526 8 256.187 8.101 393.068 119.096 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.354-12.561.482-17.433l-33.971-33.971c-4.466-4.466-11.64-4.717-16.38-.543C341.308 415.448 300.606 432 256 432c-97.267 0-176-78.716-176-176 0-97.267 78.716-176 176-176 60.892 0 114.506 30.858 146.099 77.8l-101.525-4.865c-6.845-.328-12.574 5.133-12.574 11.986v47.411c0 6.627 5.373 12 12 12h200.333c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12z"></path></svg></button>
      </div>
      <div className="body">
        <Route exact path="/" render={()=>{
          return (
            <Graph data={this.state.kiln.temperatureLog} />
          )
        }} />

        <Route exact path="/schedules" render={()=>{
          return (
            <Schedules schedules={this.state.schedules}/>
          )
        }} />

        <Route exact path="/controls" render={()=>{
          return (
            <Controls state={this.state}/>
          )
        }} />

        <Route exact path="/settings" render={()=>{
          return (
            <div className="settings-container">settings</div>
          )
        }} />

      </div>
    </>;
  }
}

export default App;
