const RealtimeData = require("../lib/dataHelpers/RealtimeData.js")

class Sync{
    constructor(fsSync, kilnDb, kiln){

        this.fsSync = fsSync
        this.kilnDb = kilnDb
        this.kiln = kiln
        this.tick = 30*1000

        this.executeIntervalFunctions = ()=>{
            this.intervalFunctions.forEach(fn=>{fn()})
        }

        this.stopInterval = ()=>{
            this.intervalIsRunning = false
            clearInterval(this.interval)
        }

        this.startInterval = ()=>{
            clearInterval(this.interval)
            this.intervalIsRunning = true
            this.interval = setInterval(()=>{
                this.executeIntervalFunctions()
            }, this.tick)
        }

        this.kilnData = {}
        this.intervalFunctions = []
        this.intervalIsRunning = false
        this.isAuthenticated = false

        this.login = ()=>{
            if (!this.isAuthenticated){
                this.stopInterval()

                let credentials = this.fsSync.getCredentials()

                if (!credentials.password || !credentials.uuid){
                    this.signup()
                }
                else {
                    this.kilnDb.login(credentials.password, credentials.uuid)
                    .then((data)=>{
                        this.isAuthenticated = true
                        this.executeIntervalFunctions()
                        this.startInterval()
                        this.fsSync.setKilnData(data)
                    })
                    .catch((error)=>{
                        if (!error.isAuthenticated){
                            setTimeout(this.login, 1*60*1000)
                        } else {
                            console.log(error)
                        }
                        this.startInterval()
                    })
                }
            }
        }

        this.signup = ()=>{
            this.stopInterval()

            this.kilnDb.signup()
            .then(data => {
                this.fsSync.setCredentials(data)
                this.login()
            })
            .catch((error)=>{
                setTimeout(this.signup, 1*60*1000)
            })
        }

        this.updateKilnData = () => {

            this.kilnDb.getKilnData()
            .then(data=>{
                this.kilnData = data
                this.fsSync.setKilnData(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.updateRealtimeData = ()=>{

            const realtimeData = new RealtimeData({type: "base", properties: {
                is_firing: this.kiln.isFiring,
                current_temperature: this.kiln.temperature,
                estimated_minutes_remaining: this.kiln.estimated_minutes_remaining
            }})

            realtimeData.get()
            .then((data)=>{
                this.kilnDb.updateRealtimeData(data)
                .then(()=>{

                })
                .catch((error)=>{
                    if (!error.isAuthenticated){
                        this.isAuthenticated = false
                    } else {
                        console.log(error)
                    }
                })
            })
            .catch((error)=>{
                console.log(error)
            })
        }

        this.updateDatabaseFiringSchedules = ()=>{
            if (this.kilnData.user_id) this.kilnDb.getAllSchedules()
            .then((data)=>{
                this.fsSync.setAllDatabaseFiringSchedules(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.updateCommands = ()=>{
            this.kilnDb.getCommands()
            .then(data=>{
                commandController.addCommands(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.addTemperatureDatapoint = ()=>{

            this.kilnDb.addTemperatureDatapoint(this.kiln.temperature)
            .then(data=>{
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.startLog = (schedule_id)=>{
            this.kilnDb.startLog(schedule_id)
            .then((data)=>{
                this.kiln_log = data
                this.addLogDatapoint()
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.endLog = ()=>{
            if (this.kiln_log) this.kilnDb.endLog(this.kiln_log.id)
            .then(data=>{
                this.kiln_log = null
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.addLogDatapoint = ()=>{

            if (this.kiln.isFiring && this.kiln_log) this.kilnDb.addLogDatapoint(this.kiln_log.id, this.kiln.temperature)
            .then(data=>{
                console.log
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.init = ()=>{
            this.intervalFunctions = [
                this.updateKilnData,
                this.updateRealtimeData,
                this.updateDatabaseFiringSchedules,
                this.addTemperatureDatapoint,
                this.addLogDatapoint,
                this.login
            ]

            this.login()
        }
    }
}

const fsSync = require("./lib/fsSync.js")
const kilnDb = require("../lib/database/kiln/index.js")
const kiln  = require("../kiln/kiln.js")

let sync = new Sync(fsSync, kilnDb, kiln)

sync.init()


module.exports = sync