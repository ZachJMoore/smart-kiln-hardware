const kiln = require("../kiln/index.js")

module.exports = (io)=>{

    io.on("connect", (socket)=>{
        console.log("a user connected")

        socket.on("disconnect", ()=>{
            console.log("a user disconnected")
        })

        socket.on("get-kiln-information", ()=>{
            let data = kiln.getInformation()
            socket.emit("kiln-information", data)
        })

    })

}