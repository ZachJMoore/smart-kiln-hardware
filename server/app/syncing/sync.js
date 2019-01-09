const RealtimeData = require("../lib/dataHelpers/RealtimeData.js")

class Sync{
    constructor(fsSync, kilnDb, kiln, commandController){

        this.fsSync = fsSync
        this.kilnDb = kilnDb
        this.kiln = kiln
        this.lowTick = 5*60*1000
        this.midTick = 30*1000
        this.highTick = 1*1000

        this.executeIntervalFunction = (priority)=>{
            if (priority === "low"){
                this.lowIntervalFunctions.forEach(fn=>{fn()})
            }
            if (priority === "medium"){
                this.midIntervalFunctions.forEach(fn=>{fn()})
            }
            if (priority === "high"){
                this.highIntervalFunctions.forEach(fn=>{fn()})
            }
        }

        this.executeIntervalFunctions = ()=>{
            this.lowIntervalFunctions.forEach(fn=>{fn()})
            this.midIntervalFunctions.forEach(fn=>{fn()})
            this.highIntervalFunctions.forEach(fn=>{fn()})
        }

        this.stopInterval = (priority)=>{
            if (priority === "low"){
                this.lowIntervalIsRunning = false
                clearInterval(this.lowInterval)
            }
            if (priority === "medium"){
                this.mediumIntervalIsRunning = false
                clearInterval(this.midInterval)
            }
            if (priority === "high"){
                this.highIntervalIsRunning = false
                clearInterval(this.highInterval)
            }
        }

        this.stopIntervals = ()=>{
            clearInterval(this.lowInterval)
            clearInterval(this.midInterval)
            clearInterval(this.highInterval)
        }

        this.startInterval = (priority)=>{
            if (priority === "low"){
                this.lowIntervalIsRunning = true
                clearInterval(this.lowInterval)
                this.lowInterval = setInterval(()=>{
                    this.executeIntervalFunction(priority)
                }, this.lowTick)
            }
            if (priority === "medium"){
                this.midIntervalIsRunning = true
                clearInterval(this.midInterval)
                this.midInterval = setInterval(()=>{
                    this.executeIntervalFunction(priority)
                }, this.midTick)
            }
            if (priority === "high"){
                this.highIntervalIsRunning = true
                clearInterval(this.highInterval)
                this.highInterval = setInterval(()=>{
                    this.executeIntervalFunction(priority)
                }, this.highTick)
            }
        }

        this.startIntervals = ()=>{
            this.lowIntervalIsRunning = true
            clearInterval(this.lowInterval)
            this.lowInterval = setInterval(()=>{
                this.executeIntervalFunction("low")
            }, this.lowTick)

            this.midIntervalIsRunning = true
            clearInterval(this.midInterval)
            this.midInterval = setInterval(()=>{
                this.executeIntervalFunction("medium")
            }, this.midTick)

            this.highIntervalIsRunning = true
            clearInterval(this.highInterval)
            this.highInterval = setInterval(()=>{
                this.executeIntervalFunction("high")
            }, this.highTick)

        }

        this.kilnData = {}

        this.lowIntervalFunctions = []
        this.lowIntervalIsRunning = false

        this.midIntervalFunctions = []
        this.midIntervalIsRunning = false

        this.highIntervalFunctions = []
        this.highIntervalIsRunning = false

        this.isAuthenticated = false

        this.login = ()=>{
            if (this.isAuthenticated) return

            this.stopIntervals()

            let credentials = this.fsSync.getCredentials()

            if (!credentials.password || !credentials.uuid){
                this.signup()
            }
            else {
                this.kilnDb.login(credentials.password, credentials.uuid)
                .then((data)=>{
                    this.isAuthenticated = true
                    this.executeIntervalFunctions("medium")
                    this.startIntervals()
                    this.fsSync.setKilnData(data)
                })
                .catch((error)=>{
                    if (!error.isAuthenticated){
                        setTimeout(this.login, 1*60*1000)
                    } else {
                        console.log(error)
                    }
                    this.startIntervals()
                })
            }

        }

        this.signup = ()=>{
            this.stopInterval("medium")

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
            if (!this.isAuthenticated) return

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
            if (!this.isAuthenticated) return

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
            if (!this.isAuthenticated) return

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
            if (!this.isAuthenticated) return

            this.kilnDb.getCommands()
            .then(data=>{
                commandController.addCommands(data)
            })
            .catch(error=>{
                if (error.isAuthenticated === false){
                    this.isAuthenticated = false
                } else {
                    console.log(error)
                }
            })
        }

        this.addTemperatureDatapoint = ()=>{
            if (!this.isAuthenticated) return

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

            if (!this.isAuthenticated) return

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

            if (!this.isAuthenticated) return

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

            if (!this.isAuthenticated) return

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

            this.midIntervalFunctions = [
                this.updateKilnData,
                this.updateRealtimeData,
                this.updateDatabaseFiringSchedules,
                this.addTemperatureDatapoint,
                this.addLogDatapoint,
                this.login
            ]

            this.highIntervalFunctions = [
                this.updateCommands
            ]

            this.login()
        }
    }
}

const fsSync = require("./lib/fsSync.js")
const kilnDb = require("../lib/database/kiln/index.js")
const kiln  = require("../kiln/kiln.js")
const commandController = require("../kiln/commandController/index.js")

let sync = new Sync(fsSync, kilnDb, kiln, commandController)

sync.init()


module.exports = sync