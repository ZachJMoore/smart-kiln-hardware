const fsSync = require("./lib/fsSync.js")


fsSync.login()
.then((data)=>{
    console.log("Kiln logged in:", data)
})
.catch((data)=>{
    console.log("There was an error logging in the kiln:", data)
})