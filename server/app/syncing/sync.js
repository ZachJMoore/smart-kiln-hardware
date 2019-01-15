const fsStore = require("./lib/fsStore.js")
const remoteIo = require("../remoteIo/index.js")

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

            remoteIo.connect(fsStore.getCredentials())

        })

    }
}

const fetchSync = require("./lib/fetchSync")

const sync = new Sync(fetchSync)

module.exports = sync