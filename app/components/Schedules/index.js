const { Components } = require("passeljs")

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
        let schArr = this.state.databaseSchedule.filter(sid=>sid===id)
        if (schArr.length === 0) return null
        else return schArr[0]
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