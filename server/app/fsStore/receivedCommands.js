const Base = require("./Base.js")

class ReceivedCommands extends Base{
    constructor(props){
        super(props)

        this.directory = this.directory.cwd("receivedCommands")

        this.deleteAllCommands = ()=>{
            this.directory.write("commands.json", [], {
                atomic: true
            })
        }

        this.removeCommand = (id)=>{
            let commands = this.getAllCommands()
            commands.some((command, index)=>{
                if (command.id === id){
                    commands.splice(index, 1)
                    return true
                } else return false
            })
            this.setAllCommands(commands)
        }

        this.addCommand = (command)=>{
            let commands = this.getAllCommands()
            commands.push(command)
            this.setAllCommands(commands)
        }

        this.bulkAddCommands = (bcs)=>{
            let commands = this.getAllCommands()
            commands = [...commands, ...bcs]
            this.setAllCommands(commands)
        }

        this.setAllCommands = (commands)=>{
            this.directory.write("commands.json", commands, {
                atomic: true
            })
        }

        this.getAllCommands = ()=>{
            let data = this.directory.read("commands.json", "json")
            if (!data) {
                data = []
            }
            return data
        }

        this.getCommand = ()=>{
            let data = this.directory.read("commands.json", "json")
            if (!data) {
                data = []
            }
            return data[0] || null
        }
    }
}

module.exports = new ReceivedCommands()