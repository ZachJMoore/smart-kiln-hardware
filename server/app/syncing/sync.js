const io = require("socket.io-client")
const fsStore = require("./lib/fsStore.js")

class Sync{
    constructor(fetchSync){
        this.fetchSync = fetchSync
        this.updateInterval = null
        this.updateIntervalTick = 1*60*1000

        this.update = ()=>{
            this.fetchSync.updateRealtimeData()
            this.fetchSync.addTemperatureDatapoint()
        }

        this.connect = ()=>{
            clearInterval(this.updateInterval)
            this.fetchSync.authenticateAsync()
            .then((data)=>{

                this.fetchSync.getDatabaseSchedulesAsync()
                .then(()=>{})
                .catch(console.log)

                this.update()

                this.updateInterval = setInterval(this.update, this.updateIntervalTick)
            })
            .catch(console.log)
        }

        this.connect()

        this.socket = io(process.env.DB_HOST + "/kiln")
        let socket = this.socket

        socket.on("connect", ()=>{

            socket.emit("authentication", fsStore.getCredentials())

            socket.on("authenticated", ()=>{
                console.log("websocket to remote server is authenticated")
            })

            socket.on("unauthorized", (error)=>{
                console.log(error)
            })

            socket.emit("test", "Kiln: Test authenticated socket emit")
        })

    }
}

const fetchSync = require("./lib/fetchSync")

const sync = new Sync(fetchSync)

module.exports = sync