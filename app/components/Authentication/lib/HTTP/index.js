const { Components } = require("passeljs")
const fetch = require("../../../../lib/fetch")
const responseHandler = require("../../../../lib/fetch/lib/responseHandler.js")

module.exports = class HTTP extends Components.Base{
    constructor(props){
        super(props)

        this.componentName = "HTTP"

        this.state = {
            authenticationError: null
        }

        this.authPath = process.env.DB_HOST + "/api/auth/kiln"
        this.options = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            redirect: "follow"
        }
    }

    createAccount(){
        return fetch(this.authPath + "/sign-up", {
            ...this.options,
            method: "get"
        }).then(responseHandler)
    }

    login(){
        return fetch(this.authPath + "/login", {
            ...this.options,
            method: "post",
            body: JSON.stringify(this.parentState.credentials)
        }).then(responseHandler)
    }

    authenticate(){

        if (!this.parentState.credentials){

            this.createAccount().then((data)=>{
                this.props.updateCredentials({
                    uuid: data.uuid,
                    password: data.password
                })
            })
            .catch((error)=>{
                this.setState({
                    authenticationError: error
                })
                this.props.updateAuthState(false)
            })

        } else {

            this.login().then((data)=>{
                this.props.updateAccountData(data)
                this.props.updateAuthState(true)
            })
            .catch((error)=>{
                this.setState({
                    authenticationError: error
                })
                this.props.updateAuthState(false)
            })

        }
    }

    componentWillMount(){
        this.stateChanged.on("authenticationError", (authenticationError)=>{
            setTimeout(()=>{
                this.authenticate()
            },(process.env.SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS || 10) * 1000)
        })
    }

    componentDidMount(){
        this.authenticate()
    }
}