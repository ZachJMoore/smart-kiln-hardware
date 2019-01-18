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

        // Ensure that we cannot start the kiln up from stored commands on first boot. This is a safety feature
        let filteredSFS = fsStore.receivedCommands.getAllCommands().filter(cm=>cm.type==="startFiringSchedule")
        fsStore.receivedCommands.setAllCommands(filteredSFS)


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

            if (command.type === "test"){
                console.log(command.properties)
            }

            if (command.type === "startFiringSchedule"){
                let firingSchedule = fsStore.firingSchedules.getDatabaseScheduleById(command.properties.firing_schedule_id)
                if (firingSchedule) {
                    kiln.startFiring(firingSchedule)
                    console.log("starting firing schedule: ", firingSchedule.name)
                }
                else console.log("Hmmm.... We dont have that schedule.")
            }

            if (command.type === "stopFiringSchedule"){
                kiln.stopFiring()
                console.log("Stopping firing")
            }

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
                else {
                    this._executeCommand(command)
                }
            } else {
                this._stopCommandInterval()
            }
        }
        this._startCommandInterval = ()=>{
            this._stopCommandInterval()
            if (this.commandsPending) this.commandInterval = setInterval(this._commandExecutioner, 1000)
        }

        this._stopCommandInterval = ()=>{
            clearInterval(this.commandInterval)
        }

        this._startCommandInterval()
    }
}

module.exports = new CommandController()