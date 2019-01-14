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

        this.connect = async ()=>{
            clearInterval(this.updateInterval)
            return this.fetchSync.authenticateAsync()
            .then((data)=>{

                this.fetchSync.getDatabaseSchedulesAsync()
                .then(()=>{})
                .catch(console.log)

                this.update()

                this.updateInterval = setInterval(this.update, this.updateIntervalTick)

                return data
            })
            .catch(console.log)
        }

        this.connect()
        .then(()=>{

            this.socket = io(process.env.DB_HOST + "/kiln")
            let socket = this.socket

            socket.on("connect", ()=>{

                socket.emit("authentication", fsStore.getCredentials())

            })

            socket.on("authenticated", ()=>{
                console.log("authenticated")

                socket.emit("owner-message", "send only to the owner")
            })

            socket.on("unauthorized", (error)=>{
                console.log(error)
            })

            socket.on("kiln-message", console.log)

            setTimeout(()=>{
                socket.emit("owner-message", "sent a little bit later")
            }, 4000)

            setTimeout(()=>{
                socket.emit("owner-message", "last message sent to the kiln owner")
            }, 8000)

        })

    }
}

const fetchSync = require("./lib/fetchSync")

const sync = new Sync(fetchSync)

module.exports = sync