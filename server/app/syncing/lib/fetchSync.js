responseError = require("../../lib/errors/responseError.js")

class FetchSync{
    constructor(store, database, kiln){
        this.store = store
        this.database = database
        this.kiln = kiln

        this.kiln_log = null
        this.logInterval = null
        this.logTick = 1*60*1000

        this.kilnData = null

        this.loginAsync = async () => {

            let credentials = this.store.getCredentials()

            let login = ({ password, uuid })=>{
                return this.database.login(password, uuid)
                .then((data)=>{
                    this.kilnData = data
                    this.store.setKilnData(data)
                    return Promise.resolve(data)
                })
                .catch(error=>{
                    if (!error.isAuthenticated){
                        this.kilnData = null
                    } else {
                        console.log(error)
                    }
                    return Promise.reject(error)
                })
            }

            if (!credentials || !credentials.password || !credentials.uuid){
                return this.signupAsync()
                .then((data)=>{
                    return login(data)
                })
            } else {
                return login(credentials)
            }
        }

        this.signupAsync = ()=>{
            return this.database.signup()
            .then(data => {
                this.store.setCredentials(data)
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
                return Promise.reject(error)
            })
        }

        this.getKilnDataAsync = () => {

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

            return this.database.getKilnData()
            .then(data=>{
                this.kilnData = data
                this.store.setKilnData(data)
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
                return Promise.reject(error)
            })
        }

        this.updateRealtimeDataAsync = ()=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

                let data = {
                    is_firing: this.kiln.isFiring,
                    current_temperature: this.kiln.temperature,
                    estimated_minutes_remaining: this.kiln.estimated_minutes_remaining
                }

                return this.database.updateRealtimeData(data)
                .then(data=>{
                    return Promise.resolve(data)
                })
                .catch(error=>{
                    if (!error.isAuthenticated){
                        this.kilnData = null
                    } else {
                        console.log(error)
                    }
                    return Promise.reject(error)
                })
        }

        this.getDatabaseSchedulesAsync = ()=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

            return this.database.getAllSchedules()
            .then((data)=>{
                this.store.setAllDatabaseSchedules(data)
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
                return Promise.reject(error)
            })
        }

        this.addTemperatureDatapointAsync = ()=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

            return this.database.addTemperatureDatapoint(this.kiln.temperature)
            .then(data=>{
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
                return Promise.reject(error)
            })
        }

        this.addTemperatureDatapoint = ()=>{

            if (!this.kilnData) return
            this.database.addTemperatureDatapoint(this.kiln.temperature)
            .then(data=>{

            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
                return Promise.reject(error)
            })
        }

        this.startLogAsync = (schedule_id)=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

            return this.database.startLog(schedule_id)
            .then((data)=>{
                this.kiln_log = data
                this.logInterval = setInterval(this._addLogDatapoint, this.logTick )
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
                return Promise.reject(error)
            })
        }

        this.endLogAsync = ()=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

            return this.database.startLog(this.kiln_log.id)
            .then((data)=>{
                this.kiln_log = null
                clearInterval(this.logInterval)
                return Promise.resolve(null)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
                return Promise.reject(error)
            })
        }

        this._addLogDatapoint = ()=>{

            if (!this.kilnData) return

            if (this.kiln_log)
            this.database.addLogDatapoint(this.kiln_log.id, this.kiln.temperature)
            .then(data=>{
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                } else {
                    console.log(error)
                }
            })
        }
    }
}

const store = require("./fsStore.js")
const database = require("../../lib/database/kiln/index.js")
const kiln  = require("../../kiln/kiln.js")

let fetchSync = new FetchSync(store, database, kiln)

module.exports = fetchSync