const Base = require("./Base.js")

class Command extends Base{
    constructor(props){
        super(props)

        const { typeCheck } = this

        this.include = {
            startFiringSchedule: [{firing_schedule: typeCheck.object}],
            stopFiringSchedule: [],
            factoryReset: [{force: typeCheck.boolean}]
        }

    }

}

module.exports = Command