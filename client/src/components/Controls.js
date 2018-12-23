import React, { Component } from "react";
import ScheduleItem from "./ScheduleItem";

import Kiln from "../lib/kiln"
let kiln = new Kiln()

class Controls extends Component{
    constructor(props){
        super(props)
        this.state = {
            scheduleID: 0,
            schedule: null,
            waiting: false
        }

        this.changeSelection = (event) => {
            let value = event.target.value
            let schedulePlaceholder = null
            this.props.state.schedules.forEach((schedule, index)=>{
                if (schedule.id === value){
                    schedulePlaceholder = schedule
                }
            })
            this.setState({scheduleID: value, schedule: schedulePlaceholder })
        }

        this.startFiring = () =>{
            this.setState({waiting: true})
            if (!this.state.schedule) {
                alert("Please select a schedule")
                this.setState({waiting: false})
                return
            }
            kiln.startFiring(this.state.schedule)
            .then(data=>data.json())
            .then((res)=>{
                console.log(res)
                alert(res.message)
            })
            .catch((error)=>{
                console.log(error)
                alert(error.message)
            })
            .then(()=>{
                this.setState({waiting: false})
            })
        }
        this.stopFiring = () =>{
            this.setState({waiting: true})
            kiln.stopFiring()
            .then(data=>data.json())
            .then((res)=>{
                console.log(res)
                alert(res.message)
            })
            .catch((error)=>{
                console.log(error)
                alert(error.message)
            })
            .then(()=>{
                this.setState({waiting: false})
            })
        }
    }

    componentDidMount(){
        if (Object.keys(this.props.state.kiln.currentSchedule).length > 0){
            this.setState({scheduleID: this.props.state.kiln.currentSchedule.id, schedule: this.props.state.kiln.currentSchedule})
        }
    }

    render(){
        return (
            <div className="controls-container">
                <div className="controls">
                    <p>Kiln is currently {this.props.state.kiln.isFiring ? "on" : "off"}</p>
                    <br/>
                    <select value={this.state.scheduleID} onChange={this.changeSelection}>
                        <option value={0} disabled>Select Schedule</option>
                        {this.props.state.schedules.map(((schedule, index)=>
                            <option value={schedule.id} key={index}>{schedule.name}</option>
                        ))}
                    </select>
                    <div className="start-stop-container">
                        <button disabled={this.state.waiting} className="start btn" onClick={this.startFiring}>Start</button>
                        <button disabled={this.state.waiting} className="stop btn" onClick={this.stopFiring}>Stop</button>
                    </div>
                </div>
                <div className="preview">
                    {this.state.schedule && <ScheduleItem schedule={this.state.schedule}/>}
                </div>
            </div>
        )
    }
}

export default Controls