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

        this.setAccountData = (accountData) => {
            this.directory.write("account_data.json", accountData, {
                atomic: true
            })
        }

        this.getAccountData = () => {
            return this.directory.read("account_data.json", "json")
        }

    }
}

module.exports = new Authentication()