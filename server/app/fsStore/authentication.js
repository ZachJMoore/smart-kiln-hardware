const Base = require("./Base.js")

class Authentication extends Base{
    constructor(props){
        super(props)

        this.directory = this.directory.cwd("authentication")

        this.setCredentials = ({ password , uuid }) => {
            this.directory.write("credentials.json", {password, uuid}, {
                atomic: true
            })
        }

        this.getCredentials = () => {
            return this.directory.read("credentials.json", "json")
        }

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

module.exports = new Authentication()