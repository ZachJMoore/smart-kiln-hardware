const Base = require("./Base.js")

class Command extends Base{
    constructor(props){
        super(props)

        const { typeCheck } = this

        this.include = {
            startFiringSchedule: [{schedule_id: typeCheck.number}],
            stopFiringSchedule: [],
            factoryReset: [{force: typeCheck.boolean}]
        }

    }

}

class CommandExtended extends Command{
    constructor(props){
        super(props)

        this.execute = (props)=>{
            this[this.type](props)
        }

        this.startFiringSchedule = (kiln) => {
            
        }


    }
}

module.exports = Command