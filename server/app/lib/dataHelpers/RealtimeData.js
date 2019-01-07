const Base = require("./Base.js")

class RealtimeData extends Base{
    constructor(props){
        super(props)

        const { typeCheck } = this

        this.include = {
            base: [
                {is_firing: typeCheck.boolean},
                {
                    firing_schedule_id: typeCheck.number,
                    allowEmpty: true,
                    allowNull: true
                },
                {current_temperature: typeCheck.number},
                {
                    estimated_minutes_remaining: typeCheck.number,
                    allowEmpty: true,
                    allowNull: true
                }
            ]
        }

    }

}

module.exports = RealtimeData