const fetch = require("../../fetch/fetch.js")
const kiln = require("../../kiln.js")

class Kiln {

    constructor(config){

        this.signUp = (password) => {
            return fetch(`${config.databaseHost}/api/private/kiln/sign-up`, {
                ...config.requestConfig.kiln,
                method: "post",
                body: JSON.stringify({
                    password: password
                })
            })
        }

        this.login = (password, uuid) => {
            return fetch(`${config.databaseHost}/api/private/kiln/login`, {
                ...config.requestConfig.kiln,
                method: "post",
                body: JSON.stringify({
                    password: password,
                    uuid: uuid
                })
            })
        }

        this.getKilnData = () => {

            return fetch(`${config.databaseHost}/api/private/kiln/get-kiln-data`, ...config.requestConfig.kiln)

        }

        this.getAllSchedules = (userId = 0)=>{

            return fetch(`${config.databaseHost}/api/private/kiln/get-all-schedules`, ...config.requestConfig.kiln)

        }

        this.updateRealtimeData = () => {

            let kilnData = kiln.getPackage()

            let data = {
                is_firing: kilnData.isFiring,
                firing_schedule_id: kilnData.currentSchedule.id,
                current_temperature: kilnData.temperature,
                estimated_minutes_remaining: kilnData.estimatedMinutesRemaining
            }


            return fetch(`${config.databaseHost}/api/private/kiln/update-realtime-data`, {
                ...config.requestConfig.kiln,
                method: "post",
                body: JSON.stringify(data)
            })

        }

    }

}

module.exports = (config)=>{
    return new Kiln(config)
}