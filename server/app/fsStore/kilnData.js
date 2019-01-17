const Base = require("./Base.js")

class KilnData extends Base{
    constructor(props){
        super(props)

        this.directory = this.directory.cwd("kilnData")

        this.setKilnData = (kilnData) => {
            this.directory.write("kiln_data.json", kilnData, {
                atomic: true
            })
        }

        this.getKilnData = () => {
            return this.directory.read("kiln_data.json", "json")
        }
    }
}

module.exports = new KilnData()