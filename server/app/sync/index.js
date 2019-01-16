const remoteIo = require("../remoteIo/index.js")
const authentication = require("./lib/authentication.js")

class Sync{
    constructor(){

        this.kilnData = null
        this.isAuthenticated = {
            http: false,
            socket: false
        }
        this.hasTriedConnecting = false

        this.connectHttp = ()=>{
            authentication.on("authenticated", (kilnData=>{
                console.log("Http: We are authenticated")
                this.kilnData = kilnData
            }))
            authentication.on("unauthorized", (error)=>{
                console.log(error)
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

        remoteIo.socket.on("unauthorized", (socket)=>{
            console.log("Socket: Something went wrong!")
            this.isAuthenticated.socket = false
        })

        this.connect()

    }
}

module.exports = new Sync()