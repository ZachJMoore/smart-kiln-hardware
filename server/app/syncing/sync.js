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
    }
}

const fetchSync = require("./lib/fetchSync")

const sync = new Sync(fetchSync)

module.exports = sync