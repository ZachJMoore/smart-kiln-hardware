import React, { Component } from 'react';
// import {Route, Link} from "react-router-dom"
import io from "socket.io-client"


class App extends Component {

  constructor(props){
    super(props)

    this.state = {}
  }

  componentDidMount(){

    this.socket = io("http://localhost:2222")

    let socket = this.socket

    socket.on("connect", ()=>{
      console.log("We are connected!")

      socket.emit("message", "Here!")
      socket.emit("message-s", "Hey hey hey!")
      socket.emit("get-kiln-data")
    })

    socket.on("kiln-data", (data)=>{
      this.setState(data)
    })

    socket.on("message-s", (data)=>{
      console.log("Server to user: " + data)
    })

    socket.on("message", (data)=>{
      console.log("Kiln to user: " + data)
    })

    socket.on("account-data", (data)=>{
      this.setState({accountData: data})
    })
    socket.on("firing-schedules", (data)=>{
      this.setState({firingSchedules: data})
    })

  }

  render() {
    return <div>
      {Object.keys(this.state).map((key, index)=>{
        return <li key={index}>{`${key}: ${this.state[key]}`}</li>
      })}
    </div>;
  }
}

export default App;
