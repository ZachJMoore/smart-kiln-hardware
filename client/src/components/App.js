import React, { Component } from 'react';
import { Button } from 'antd';
import '../styles/App.less';
import kilnIo from "../lib/kilnIo"

class App extends Component {

  state = {}

  componentDidMount(){
    kilnIo.socket.on("connect", ()=>{
      console.log("We are connected")
    })

    kilnIo.socket.on("kiln-data", (data)=>{
      this.setState(data)
    })


  }
  render() {
    return (
      <div className="App">
        <Button type="primary" onClick={kilnIo.emitGetKilnData}>Button</Button>
      </div>
    );
  }
}

export default App;
