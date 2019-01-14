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

      socket.emit("get-kiln-information")
    })

    socket.on("kiln-information", (data)=>{
      this.setState(data)
    })

    setInterval(()=>{
      socket.emit("get-kiln-information")
    }, 1*1000)
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
