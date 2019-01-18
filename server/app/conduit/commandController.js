const fsStore = require("../fsStore/index.js")
const kiln = require("../kiln/index.js")
const dataConstructors = require("../lib/dataHelpers/constructors/index.js")
const remoteIo = require("../remoteIo/index.js")
const requestQueue = require("./requestQueue")

class CommandController{
    constructor(){

        this.commandsPending = true
        this.commandInterval = null
        this.previousCommand = null

        remoteIo.socket.on("commands", (data)=>{
            this._addCommands(data)
            this.commandsPending = true
            this._startCommandInterval()
        })

        remoteIo.socket.on("remove-command", (id)=>{
            fsStore.receivedCommands.removeCommand(id)
        })

        this._addCommands = (commands)=>{
            this.commands = commands
            fsStore.receivedCommands.bulkAddCommands(commands)
        }

        this._executeCommand = (command)=>{
            // start
            console.log("this", command)
            // finish
            requestQueue.updateCommand(command.id)
            fsStore.receivedCommands.removeCommand(command.id)
        }

        // command interval
        this._commandExecutioner = ()=>{
            if (this.commandsPending){
                let command = fsStore.receivedCommands.getCommand()
                if (!command) this.commandsPending = false
                else if (this.previousCommand && this.previousCommand.id === command.id) return
                else this._executeCommand(command)
            } else {
                this._stopCommandInterval()
            }
        }
        this._startCommandInterval = ()=>{
            this._stopCommandInterval()
            if (this.commandsPending) this._commandExecutioner()
            if (this.commandsPending) this.commandInterval = setInterval(this._commandExecutioner, 1000)
        }

        this._stopCommandInterval = ()=>{
            clearInterval(this.commandInterval)
        }

        this._startCommandInterval()
    }
}

module.exports = new CommandController()