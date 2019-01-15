const io = require("socket.io-client")

class RemoteIo{
    constructor(){
        this.socketOn = []
        this.socketEmit = []
        this.socket = {}
        this.socket.on = (...args) => {
            this.socketOn.push(args)
        }
        this.socket.emit = (...args) => {
            // this.socketEmit.push(args)
        }
        this.isAuthenticated = false
        this.isConnected = false
        this.interval = null
        this.credentials = null

        this.connect = (credentials)=>{
            if (Object.keys(this.socket).length > 2) {
                this.socket.destroy();
                this.socket = {}
                this.socket.on = (...args) => {
                    this.socketOn.push(args)
                }
                this.socket.emit = (...args) => {
                    this.socketEmit.push(args)
                }
            }

            if (credentials){
                this.credentials = credentials
            }

            this.socket = null;
            this.socket = io(process.env.DB_HOST + "/kiln")

            this.socket.on("connect", ()=>{

                this.isConnected = true

                this.socket.emit("authentication", this.credentials)

            })

            this.socket.on("authenticated", ()=>{
                console.log("authenticated")
                this.isAuthenticated = true
            })

            this.socket.on("disconnect", ()=>{
                this.isAuthenticated = false
                this.isConnected = false

                this.interval = setInterval(() => {
                    if (this.isConnected) {
                        clearInterval(this.interval);
                        this.interval = null;
                    }
                    this.reconnect()
                }, 5000);
            })

            this.socketOn.forEach((object)=>{
                this.socket.on(...object)
            })

            this.socketEmit.forEach((object)=>{
                this.socket.emit(...object)
            })

            return this.socket

        }

        this.reconnect = (credentials)=>{
            if (credentials) this.credentials = credentials
            this.socket.connect()
        }
    }
}

let remoteIo = new RemoteIo()

module.exports = remoteIo