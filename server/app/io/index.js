const remoteIo = require("../remoteIo/index.js")
const fsStore = require("../fsStore/index.js")
const kiln = require("../kiln/index.js")

module.exports = (io)=>{
    io.on("connection", (socket)=>{

        socket.on("message", (data)=>{
            console.log("User to kiln: " + data)
        })

        socket.emit("message", "Here!")

        socket.on("message-s", (data)=>{
            remoteIo.socket.emit("message-s", data)
        })

        socket.on("get-kiln-data", ()=>{
            socket.emit("kiln-data", kiln.getInformation())
        })

    })

    setInterval(()=>{
        if (remoteIo.isAuthenticated){
            remoteIo.socket.emit("get-account-data", (error)=>{
                if (error) console.log(error)
            })
            remoteIo.socket.emit("get-firing-schedules", (error)=>{
                if (error) console.log(error)
            })
            remoteIo.socket.emit("get-commands", (error)=>{
                if (error) console.log(error)
            })
            remoteIo.socket.emit("add-temperature-datapoint", kiln.temperature, (error)=>{
                if (error) console.log(error)
            })
        }
    }, 5 * 1000)

    remoteIo.socket.on("account-data", (data)=>{
        io.emit("account-data", data)
        fsStore.authentication.setAccountData(data)
    })
    remoteIo.socket.on("firing-schedules", (data)=>{
        io.emit("firing-schedules", data)
        fsStore.firingSchedules.setAllDatabaseSchedules(data)
    })
    remoteIo.socket.on("commands", (data)=>{
        fsStore.receivedCommands.setAllCommands(data)
    })

    remoteIo.socket.on("message-s", (data)=>{
        io.emit("message-s", data)
    })

    remoteIo.socket.on("connect", ()=>{
        remoteIo.socket.emit("message", "Here!")
    })

    remoteIo.socket.on("message", (data)=>{
        console.log("server to kiln: " + data)
      })

}