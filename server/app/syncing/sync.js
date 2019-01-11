class Sync{
    constructor(fetchSync){
        this.fetchSync = fetchSync

        this.fetchSync.loginAsync()
        .then((data)=>{
            console.log(data)
        })
        .catch(console.log)
    }
}

const fetchSync = require("./lib/fetchSync")

const sync = new Sync(fetchSync)

module.exports = sync