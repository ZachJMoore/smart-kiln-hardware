const CommandExtended = require("./lib//CommandExtended.js")
const kiln = require("../kiln.js")
const sync = require("../../syncing/sync")

class CommandController{
    constructor(kiln, databaseUpdate){

        this.kiln = kiln

        this.commands = []

        this.executeCommand = (command)=>{
            command.execute(this.kiln, databaseUpdate)
        }

        this.executeCommands = ()=>{
            this.commands.forEach((command, index)=>{
                this.executeCommand(command)
                this.commands.splice(index, 1)
            })
        }

        this.addCommands = (cArray)=>{
            cArray.forEach(data => {
                let command = new CommandExtended(data.command)

                command.get()
                .then(validatedProps=>{
                    this.commands.push(command)
                })
                .catch((error)=>{

                })
            });

            this.executeCommands()
        }
    }
}

module.exports = new CommandController(kiln, sync.updateRealtimeData)