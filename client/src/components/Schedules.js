import React, { Component } from "react"
import ScheduleItem from "./ScheduleItem"

class Schedules extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        return (
            <div className="schedules-container">

                {this.props.schedules.map((schedule, index)=>{
                    return <ScheduleItem schedule={schedule} key={index}/>
                })}

            </div>
        )
    }
}

export default Schedules