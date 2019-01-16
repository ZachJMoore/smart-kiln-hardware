const responseHandler = require("../../lib/fetch/responseHandler.js")
const fetch = require("../../lib/fetch/fetch.js")
const fsStore = require("../../fsStore/index.js")

class Authentication{
    constructor(){

        this.credentials = null
        this.isAuthenticated = false

        this.host = process.env.DB_HOST
        this.base = "/api/private/kiln"
        this.options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            redirect: "follow"
        }
        this.database = {

            signup: async () => {
                return fetch(this.host + "/api/auth/kiln/sign-up", {
                    ...this.options,
                    method: "get"
                }).then(responseHandler)
            },
            login: async (password, uuid) => {
                return fetch(this.host + "/api/auth/kiln/login", {
                    ...this.options,
                    method: "post",
                    body: JSON.stringify({ password, uuid })
                }).then(responseHandler)
            }
        }

        this.onAuthenticated = []

        this.onUnauthorized = []

        this.on = (text, fn)=>{
            if (text === "authenticated") this.onAuthenticated.push(fn)
            if (text === "unauthorized") this.onUnauthorized.push(fn)
        }

        this.authenticateAsync = async (credentials, forceNew = false) => {

            if (credentials) this.credentials = credentials
            else this.credentials = fsStore.authentication.getCredentials()

            let login = ({ password, uuid })=>{
                return this.database.login(password, uuid)
                .then((data)=>{
                    this.kilnData = data
                    fsStore.authentication.setKilnData(data)
                    return Promise.resolve(data)
                })
                .catch(error=>{
                    if (!error.isAuthenticated){
                        this.kilnData = null
                    }
                    return Promise.reject(error)
                })
            }

            if (forceNew || !this.credentials || !this.credentials.password || !this.credentials.uuid){
                return this._signupAsync()
                .then((data)=>{
                    return login(data)
                })
            } else {
                return login(this.credentials)
            }
        }

        this._signupAsync = async ()=>{
            return this.database.signup()
            .then(data => {
                fsStore.authentication.setCredentials(data)
                return Promise.resolve(data)
            })
            .catch(error=>{
                if (!error.isAuthenticated){
                    this.kilnData = null
                }
                return Promise.reject(error)
            })
        }

        this.interval = null

        this.connect = (credentials)=>{
            this.authenticateAsync(credentials).then((kilnData)=>{
                this.isAuthenticated = true
                this.onAuthenticated.forEach(fn=>{
                    fn(kilnData)
                })
            })
            .catch((error)=>{
                this.isAuthenticated = false
                this.onUnauthorized.forEach(fn=>{
                    fn(error)
                })
                this.interval = setInterval(() => {
                    if (this.isAuthenticated) {
                        clearInterval(this.interval);
                        this.interval = null;
                    }
                    this.credentials = fsStore.authentication.getCredentials()
                    this.connect()
                }, 5000);
            })
        }
    }
}

module.exports = new Authentication()