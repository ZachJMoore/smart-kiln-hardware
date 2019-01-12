const fs = require("fs")
ROOT_APP_PATH = fs.realpathSync('.')

class FSStore {


    constructor(jetpack){

        this.root = ROOT_APP_PATH + "/app/config/"

        this.setCredentials = ({ password , uuid }) => {
            jetpack.write(this.root + "credentials.json", {password, uuid}, {
                atomic: true
            })
        }

        this.getCredentials = (fs = false) => {
            return jetpack.read(this.root + "credentials.json", "json")
        }

        this.setKilnData = (kilnData) => {
            jetpack.write(this.root + "kiln_data.json", kilnData, {
                atomic: true
            })
        }

        this.getKilnData = (fs = false) => {
            return jetpack.read(this.root + "kiln_data.json", "json")
        }

        this.setAllDatabaseSchedules = (schedules)=>{
            jetpack.write(this.root + "database_schedules.json", schedules, {
                atomic: true
            })
        }
        this.getAllDatabaseSchedules = ()=>{
            let schedules = jetpack.read(this.root + "database_schedules.json", "json")
            if (Array.isArray(schedules)) return schedules
            else return []
        }

        this.setAllLocalSchedules = (schedules)=>{
            jetpack.write(this.root + "local_schedules.json", schedules, {
                atomic: true
            })
        }

        this.getAllLocalSchedules = ()=>{
            let schedules = jetpack.read(this.root + "local_schedules.json", "json")
            if (!Array.isArray(schedules)) return []
            else return schedules
        }

        this.addLocalSchedule = (schedule)=>{
            let schedules = this.getAllLocalSchedules()
            schedules.push(schedule)
            this.setAllLocalSchedules(schedules)
        }

        this.getAllSchedules = ()=>{
            const databaseSchedules = this.getAllDatabaseSchedules()
            const localSchedules = this.getAllLocalSchedules()

            return [...databaseSchedules, ...localSchedules]
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

const jetpack = require("fs-jetpack")
let fsStore = new FSStore(jetpack)

module.exports = fsStore