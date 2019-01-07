const Command = require("../lib/dataHelpers/Command.js")
const kiln = require("./kiln.js")
const sync = require("../syncing/sync")

class CommandController{
    constructor(kiln, update){

        this.commands = []

        this.addCommands = (cArray)=>{
            cArray.forEach(data => {
                let command = new Command(data.command)

                command.get()
                .then(validatedProps=>{
                    this.commands.push(command)
                })
                .catch((error)=>{

                })
            });
        }
    }
}

module.exports = new CommandController(kiln, sync.updateRealtimeData)