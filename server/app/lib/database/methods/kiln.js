const fetch = require("../../fetch/fetch.js")

class Kiln {

    constructor(config){

        this.signUp = (password) => {
            return fetch(`${config.databaseHost}/api/kiln/sign-up`, {
                ...config.requestConfig.kiln,
                method: "post",
                body: JSON.stringify({
                    password: password
                })
            })
        }

        this.login = (password, uuid) => {
            return fetch(`${config.databaseHost}/api/kiln/login`, {
                ...config.requestConfig.kiln,
                method: "post",
                body: JSON.stringify({
                    password: password,
                    uuid: uuid
                })
            })
        }

        this.getKilnData = () => {

            return fetch(`${config.databaseHost}/api/kiln/get-kiln-data`, ...config.requestConfig.kiln)

        }

        this.getAllSchedules = (userId = 0)=>{

            return fetch(`${config.databaseHost}/api/kiln/get-all-schedules`, ...config.requestConfig.kiln)

        }

    }

}

module.exports = (config)=>{
    return new Kiln(config)
}