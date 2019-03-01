const { Components } = require("passeljs")
const ServerCommandRunner = require("./lib/ServerCommandRunner")
const LocalCommandRunner = require("./lib/LocalCommandRunner")
const _ = require("lodash")

module.exports = class CommandRunner extends Components.Base{
    constructor(props){
        super(props)

        this.state = {
            completedCommands: []
        }

        this.options = {
            fsState:{
                recurrentUpdateLimit: null,
                options: {
                    include: [
                        {
                            key: "completedCommands"
                        }
                    ]
                }
            },
            globalState:{
                options: {
                    include: [
                        {
                            key: "completedCommands",
                            emit: false
                        }
                    ]
                }
            }
        }

        this.addCompletedCommand = this.addCompletedCommand.bind(this)

    }

    trimCompletedLogs(){

        let limit = process.env.COMMAND_COMPLETED_LIMIT_COUNT
        limit = parseInt(limit)
        if (isNaN(limit)) limit = 30

        if (logs.length > limit){
            let sliceCount = logs.length - limit
            logs.splice(0, sliceCount)
        }

    }

    addCompletedCommand(command){
        let cmd = _.clone(command)
        this.setState((state)=>{
            state.completedCommands.push(cmd)
            this.trimCompletedCommands(state.completedCommands)
            return state
        })

        // TODO: Keep a backup log for uploading
    }

    componentWillMount(){

        this.stateChanged.on("completedCommands", (completedCommands)=>{
            if (completedCommands.length > 0){

                let cmd = completedCommands[completedCommands.length - 1]
                this.global.socket.emit("command-completed", cmd)
                this.global.io.emit(`command-completed`, cmd)

            }
        })

        this.use(ServerCommandRunner, {
            addCompletedCommand: this.addCompletedCommand
        })
        this.use(LocalCommandRunner, {
            addCompletedCommand: this.addCompletedCommand
        })

    }
}