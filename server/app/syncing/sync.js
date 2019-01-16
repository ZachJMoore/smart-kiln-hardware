const fsStore = require("./lib/fsStore.js")
const fetchSync = require("./lib/fetchSync")
const remoteIo = require("../remoteIo/index.js")

class Sync{
    constructor(){

        this.connect = async ()=>{
            clearInterval(this.updateInterval)
            return fetchSync.authenticateAsync()
            .then((data)=>{

                fetchSync.getDatabaseSchedulesAsync()
                .then(()=>{})
                .catch(console.log)

                this.update()

                this.updateInterval = setInterval(this.update, this.updateIntervalTick)

                return data
            })
            .catch(console.log)
        }

        remoteIo.connect(fsStore.getCredentials())

        this.connect()
        .then(()=>{
            console.log("logged in through http")
        })

    }
}


module.exports = new Sync()