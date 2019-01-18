const Base = require("./Base.js")

class FiringSchedules extends Base{
    constructor(props){
        super(props)

        this.directory = this.directory.cwd("firingSchedules")


        this.setAllDatabaseSchedules = (schedules)=>{
            this.directory.write("database_schedules.json", schedules, {
                atomic: true
            })
        }
        this.getAllDatabaseSchedules = ()=>{
            let schedules = this.directory.read("database_schedules.json", "json")
            if (Array.isArray(schedules)) return schedules
            else return []
        }

        this.getDatabaseScheduleById = (id)=>{
            let schedules = this.getAllDatabaseSchedules()
            let sch = null

            schedules.some((schedule, index)=>{
                if (schedule.id === id){
                    sch = schedule
                    return true
                } else return false
            })

            return sch
        }

        this.setAllLocalSchedules = (schedules)=>{
            this.directory.write("local_schedules.json", schedules, {
                atomic: true
            })
        }

        this.getAllLocalSchedules = ()=>{
            let schedules = this.directory.read("local_schedules.json", "json")
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

        this.removeLocalScheduleById = (id)=>{
            let schedules = this.getAllLocalSchedules()
            let schNew = schedules.splice()

            schedules.some((schedule, index)=>{
                if (schedule.id === id){
                    schNew.splice(index, 1)
                    return true
                } else return false
            })

            this.setAllLocalSchedules(schNew)
        }
    }
}

module.exports = new FiringSchedules()