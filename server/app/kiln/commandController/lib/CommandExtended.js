const Command = require("../../../lib/dataHelpers/Command.js")
const FiringSchedule = require("../../../lib/dataHelpers/FiringSchedule.js")

class CommandExtended extends Command{
    constructor(props){
        super(props)

        this.execute = (props, callback)=>{
            this[this.type](props, callback)
        }

        this.startFiringSchedule = (kiln, callback) => {
            if (!this.validatedProperties) return

            const schedule = new FiringSchedule({type: "schedule", properties: this.validatedProperties.firing_schedule})

            schedule.get()
            .then((validated)=>{
                kiln.startFiring(validated.properties)
                if (callback) callback()
            })
            .catch((error)=>{
                if (callback) callback()
                throw Error(error)
            })

        }

        this.stopFiringSchedule = (kiln, callback)=>{
            kiln.stopFiring()
            if (callback) callback()
        }


    }
}

module.exports = CommandExtended