const fsSync = require("./lib/fsSync.js")
const dbMethods = require("../lib/database/methods/index.js")
const responseHandler = require("../lib/fetch/responseHandler.js")


fsSync.login()
.then((data)=>{
    console.log("Kiln logged in:", data)

    setInterval(()=>{

            dbMethods.kiln.updateRealtimeData()
        .then(responseHandler)
        .then(data=>{
            console.log(data)
        })
        .catch((console.log))

    }, 10*1000)

})
.catch((data)=>{
    console.log("There was an error logging in the kiln:", data)
})