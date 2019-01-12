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

        this.authenticateAsync = async () => {

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
                    }
                    return Promise.reject(error)
                })
            }

            if (!credentials || !credentials.password || !credentials.uuid){
                return this._signupAsync()
                .then((data)=>{
                    return login(data)
                })
            } else {
                return login(credentials)
            }
        }

        this._signupAsync = async ()=>{
            return this.database.signup()
            .then(data => {
                this.store.setCredentials(data)
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return Promise.reject(error)
            })
        }

        this.getKilnDataAsync = async () => {

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
                }
                return Promise.reject(error)
            })
        }

        this.updateRealtimeDataAsync = async ()=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

                let data = {
                    type: "base",
                    properties: {
                        is_firing: this.kiln.isFiring,
                        current_temperature: this.kiln.temperature,
                        estimated_minutes_remaining: this.kiln.estimated_minutes_remaining
                    }
                }

                return this.database.updateRealtimeData(data)
                .then(data=>{
                    return Promise.resolve(data)
                })
                .catch(error=>{
                    if (!error.isAuthenticated){
                        this.kilnData = null
                    }
                    return Promise.reject(error)
                })
        }

        this.updateRealtimeData = ()=>{

            if (!this.kilnData) return responseError("kiln is not authenticated", null, 400, false)

            let data = {
                type: "base",
                properties: {
                    is_firing: this.kiln.isFiring,
                    current_temperature: this.kiln.temperature,
                    estimated_minutes_remaining: this.kiln.estimated_minutes_remaining
                }
            }

            return this.database.updateRealtimeData(data)
            .then(data=>{
                return data
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return error
            })
        }

        this.getDatabaseSchedulesAsync = async ()=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

            if (!this.kilnData.user_id || typeof this.kilnData.user_id !== typeof 1){
                this.store.setAllDatabaseSchedules([])
                return Promise.resolve([])
            }

            return this.database.getAllSchedules()
            .then((data)=>{
                this.store.setAllDatabaseSchedules(data)
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return Promise.reject(error)
            })
        }

        this.getDatabaseSchedules = ()=>{

            if (!this.kilnData) return responseError("kiln is not authenticated", null, 400, false)

            return this.database.getAllSchedules()
            .then((data)=>{
                this.store.setAllDatabaseSchedules(data)
                return data
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return error
            })
        }

        this.addTemperatureDatapointAsync = async ()=>{

            if (!this.kilnData) return Promise.reject(responseError("Kiln is not authenticated", null, 400, false))

            return this.database.addTemperatureDatapoint(this.kiln.temperature)
            .then(data=>{
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return Promise.reject(error)
            })
        }

        this.addTemperatureDatapoint = ()=>{

            if (!this.kilnData) return responseError("kiln is not authenticated", null, 400, false)

            return this.database.addTemperatureDatapoint(this.kiln.temperature)
            .then(data=>{
                return data
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return error
            })
        }

        this.startLogAsync = async (schedule_id)=>{

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
                }
                return Promise.reject(error)
            })
        }

        this.endLogAsync = async()=>{

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
                }
                return Promise.reject(error)
            })
        }

        this._addLogDatapoint = ()=>{

            if (!this.kilnData) return responseError("kiln is not authenticated", null, 400, false)

            if (this.kiln_log)
            return this.database.addLogDatapoint(this.kiln_log.id, this.kiln.temperature)
            .then(data=>{
                return data
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return error
            })
        }
    }
}

const store = require("./fsStore.js")
const database = require("../../lib/database/kiln/index.js")
const kiln  = require("../../kiln/kiln.js")

let fetchSync = new FetchSync(store, database, kiln)

module.exports = fetchSync