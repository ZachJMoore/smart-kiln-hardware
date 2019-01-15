const kiln = require("../kiln/kiln.js")

module.exports = (io)=>{

    let number = 0

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