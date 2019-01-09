const fsStore = require("./fsStore.js")


class FSSync {


    constructor(fsStore){

        this.setCredentials = ({ password , uuid }) => {
            fsStore.set("password", password)
            fsStore.set("uuid", uuid)
        }

        this.getCredentials = () => {
            const password = fsStore.get("password", null)
            const uuid = fsStore.get("uuid", null)

            return ({password: password, uuid: uuid})
        }

        this.setKilnData = (kilnData) => {
            fsStore.set("kiln", kilnData)
        }

        this.getKilnData = () => {
            return fsStore.get("kiln", {})
        }

        this.setAllDatabaseSchedules = (schedules)=>{
            fsStore.set("databaseSchedules", schedules)
        }
        this.getAllDatabaseSchedules = ()=>{
            return fsStore.get("databaseSchedules", [])
        }

        this.addLocalSchedule = (schedule)=>{
            let schedules = this.getAllLocalSchedules()
            schedules.push(schedule)
            fsStore.set("localSchedules", schedules)
        }

        this.setAllLocalSchedules = (schedules)=>{
            fsStore.set("localSchedules", schedules)
        }

        this.getAllLocalSchedules = ()=>{
            return fsStore.get("localSchedules", [])
        }

        this.getAllSchedules = ()=>{
            const dbSchedules = fsStore.get("databaseSchedules", [])
            const localSchedules = fsStore.get("localSchedules", [])

            return [...dbSchedules, ...localSchedules]
        }

        this.getScheduleById = (id)=>{
            const schedules = this.getAllSchedules()
            let schedule = null

            schedules.some(sch=>{
                if (sch.id === id) {
                    schedule = sch
                    return true
                }
            })
            return schedule
        }

    }

}

let fsSync = new FSSync(fsStore)

module.exports = fsSync