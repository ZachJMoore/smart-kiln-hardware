const responseHandler = require("../../../lib/fetch/responseHandler.js")
const fetch = require("../../fetch/fetch.js")

class Kiln {

    constructor(){

        this.host = process.env.DB_HOST

        this.base = "/api/private/kiln"

        this.options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            redirect: "follow"
        }

        this.signup = () => {
            return fetch(this.host + "/api/auth/kiln/sign-up", {
                ...this.options,
                method: "get"
            }).then(responseHandler)
        }

        this.login = (password, uuid) => {
            return fetch(this.host + "/api/auth/kiln/login", {
                ...this.options,
                method: "post",
                body: JSON.stringify({ password, uuid })
            }).then(responseHandler)
        }

        this.getKilnData = () => {

            return fetch(this.host + this.base + "/get-kiln-data",{
                ...this.options,
                method: "get"
            }).then(responseHandler)
        }

        this.getAllSchedules = ()=>{

            return fetch(this.host + this.base + "/get-all-schedules",{
                ...this.options,
                method: "get"
            }).then(responseHandler)
        }

        this.updateRealtimeData = (realtime_data) => {
            return fetch(this.host + this.base + "/update-realtime-data",{
                ...this.options,
                method: "post",
                body: JSON.stringify({ realtime_data })
            }).then(responseHandler)
        }

        this.getCommands = () => {

            return fetch(this.host + this.base + "/get-commands",{
                ...this.options,
                method: "get"
            }).then(responseHandler)

        }

        this.updateReceivedCommands = (commands) => {

            return fetch(this.host + this.base + "/update-received-commands",{
                ...this.options,
                method: "post",
                body: JSON.stringify({ commands })
            }).then(responseHandler)
        }

        this.addAssociateSecret = () => {

            return fetch(this.host + this.base + "/add-associate-secret",{
                ...this.options,
                method: "get"
            }).then(responseHandler)

        }

        this.addTemperatureDatapoint = (temperature) => {

            return fetch(this.host + this.base + "/add-temperature-datapoint",{
                ...this.options,
                method: "post",
                body: JSON.stringify({temperature: temperature})
            }).then(responseHandler)

        }

        this.startLog = (schedule_id) => {

            return fetch(this.host + this.base + "/start-log",{
                ...this.options,
                method: "post",
                body: JSON.stringify({schedule_id: schedule_id})
            }).then(responseHandler)

        }

        this.endLog = (kiln_log_id) => {

            return fetch(this.host + this.base + "/end-log",{
                ...this.options,
                method: "post",
                body: JSON.stringify({kiln_log_id: kiln_log_id})
            }).then(responseHandler)

        }

        this.addLogDatapoint = (kiln_log_id, temperature) => {

            return fetch(this.host + this.base + "/add-log-datapoint",{
                ...this.options,
                method: "post",
                body: JSON.stringify({temperature: temperature, kiln_log_id: kiln_log_id})
            }).then(responseHandler)
        }

    }

}

module.exports = new Kiln()