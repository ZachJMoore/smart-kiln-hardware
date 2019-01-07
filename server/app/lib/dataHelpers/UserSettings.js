const Base = require("./Base.js")

class UserSettings extends Base{
    constructor(props){
        super(props)

        const { typeCheck } = this

        this.include = {
            base: [
                {id: typeCheck.number},
                {temperature_display_type: typeCheck.string},
            ]
        }

    }

}

module.exports = UserSettings