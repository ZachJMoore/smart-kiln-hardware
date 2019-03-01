const { Components } = require("passeljs")
const _ = require("lodash")

module.exports = class Schedules extends Components.Base{
    constructor(props){
        super(props)

        this.state = {
            databaseSchedules: [],
        }

        this.options = {
            fsState: {
                recurrentUpdateLimit: null,
                options: {
                    include: [
                        {
                            key: "databaseSchedules"
                        }
                    ]
                }
            },
            globalState: {
                options: {
                    include: [
                        {
                            key: "databaseSchedules",
                            emit: true
                        }
                    ]
                }
            },
            exposeFunctions: {
                options:{
                    include:[
                        {
                            key: "getScheduleById"
                        }
                    ]
                }
            }
        }
    }

    getScheduleById(id){
        return _.find(this.state.databaseSchedules, {id: id})
    }

    componentDidMount(){

        this.global.socket.on("firing-schedules", (databaseSchedules)=>{
            this.setState({
                databaseSchedules
            })
        })

        this.global.socket.emit("get-all-firing-schedules")

    }
}