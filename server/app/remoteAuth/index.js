const remoteIo = require("../remoteIo/index.js")
const authentication = require("./lib/authentication.js")

class RemoteAuth {
    constructor(){

        this.isAuthenticated = {
            http: false,
            socket: false
        }
        this.hasTriedConnecting = false

        this.connectHttp = ()=>{
            authentication.on("authenticated", (kilnData=>{
                console.log("Http: We are authenticated")
                this.isAuthenticated.http = true
            }))
            authentication.on("unauthorized", (error)=>{
                this.isAuthenticated.http = false
                console.log("HTTP: There was an error logging in")
            })
            authentication.connect()
        }

        this.connectSocket = ()=>{
            if (!this.hasTriedConnecting)remoteIo.connect()
            else remoteIo.reconnect()
        }

        this.connect = ()=>{
            this.connectHttp()
            this.connectSocket()
        }

        remoteIo.socket.on("authenticated", (socket)=>{
            this.isAuthenticated.socket = true
            console.log("Socket: We are authenticated!")
        })

        remoteIo.socket.on("unauthorized", (error)=>{
            console.log(error)
            console.log("Socket: Something went wrong!")
            this.isAuthenticated.socket = false
        })

        remoteIo.socket.on("disconnect", ()=>{
            this.isAuthenticated.socket = false
            console.log("Socket: We just got disconnected")
        })

        this.connect()

    }
}

module.exports = new RemoteAuth()