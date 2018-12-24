class Kiln {

    constructor(config){

        this.signUp = (password) => {
            return fetch(`${config.databaseHost}/api/kiln/sign-up`, {
                ...config.kiln.requestConfig,
                method: "post",
                body: JSON.stringify({
                    password: password
                })
            })
        }

        this.login = (password, uuid) => {
            return fetch(`${config.databaseHost}/api/kiln/sign-up`, {
                ...config.kiln.requestConfig,
                method: "post",
                body: JSON.stringify({
                    password: password,
                    uuid: uuid
                })
            })
        }

        this.getKilnData = () => {

            return fetch(`${config.databaseHost}/api/kiln/get-kiln-data`, ...config.kiln.requestConfig)

        }

        this.getAllSchedules = (userId = 0)=>{

            return fetch(`${config.databaseHost}/api/kiln/get-all-schedules`, ...config.kiln.requestConfig)

        }

    }

}

module.exports = (config)=>{
    return new Kiln(config)
}