const Base = require("./Base.js")

class FiringSchedule extends Base {
    constructor(props) {
        super(props)

        const { typeCheck } = this

        this.include = {
            schedule: [
                { id: typeCheck.number },
                { name: typeCheck.string },
                { cone: typeCheck.number },
                {
                    description: typeCheck.string,
                    allowEmpty: true,
                    allowNull: true
                },
                { is_public: typeCheck.boolean },
                {
                    firing_schedule_ramps: typeCheck.array,
                    arrayChildTypeCheck: typeCheck.object,
                    childrenCheck: [
                        { id: typeCheck.number, isUnique: true},
                        { ramp_index: typeCheck.number, isUnique: true },
                        { ramp_rate: typeCheck.number },
                        { target_temperature: typeCheck.number },
                        { hold_minutes: typeCheck.number }
                    ]
                }
            ],
            base: [
                { id: typeCheck.number },
                { name: typeCheck.string },
                { cone: typeCheck.number },
                {
                    description: typeCheck.string,
                    allowEmpty: true
                },
                { is_public: typeCheck.boolean }
            ]
        }

    }

}

module.exports = FiringSchedule