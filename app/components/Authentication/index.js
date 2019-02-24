const { Components } = require("passeljs")
const IO = require("./lib/IO")
const HTTP = require("./lib/HTTP")

module.exports = class Authentication extends Components.Base{
    constructor(props){
        super(props)

        this.componentName = "Authentication"

        this.state = {
            httpIsAuthenticated: false,
            socketIsAuthenticated: false,
            credentials: null,
            account: null
        }

        this.options = {
            fsState: {
                recurrentUpdateLimit: null,
                options: {
                    include: [
                        {
                            key: "credentials"
                        },
                        {
                            key: "account"
                        }
                    ]
                }
            },
            globalState: {
                options: {
                    include: [
                        {
                            key: "account",
                            emit: true
                        }
                    ]
                }
            }
        }

        this.socket = null
        this.updateSocketAuthState = this.updateSocketAuthState.bind(this)

        this.updateHTTPAuthState = this.updateHTTPAuthState.bind(this)
        this.updateAccountData = this.updateAccountData.bind(this)
        this.updateCredentials = this.updateCredentials.bind(this)
    }

    updateSocketAuthState(value){
        this.setState({
            socketIsAuthenticated: value
        })
    }

    updateHTTPAuthState(value){
        this.setState({
            httpIsAuthenticated: value
        })
    }

    updateAccountData(data){
        this.setState({
            account: data
        })
    }

    updateCredentials(credentials){
        this.setState({
            credentials: {
                uuid: credentials.uuid,
                password: credentials.password
            }
        })
    }

    componentWillMount(){
    }

    componentDidMount(){

        this.IO = this.use(IO, {
            updateAuthState: this.updateSocketAuthState,
            updateAccountData: this.updateAccountData
        })

        this.http = this.use(HTTP, {
            updateAuthState: this.updateHTTPAuthState,
            updateAccountData: this.updateAccountData,
            updateCredentials: this.updateCredentials
        })
    }
}