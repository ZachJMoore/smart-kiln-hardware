const { Components } = require("passeljs")
const wifiHelper = require("./lib/wifiHelper.js")

module.exports = class WifiManager extends Components.Base{
    constructor(props){
        super(props)

        this.state = {
            mode: "ap",
            defaultBootMode: (process.env.WIFI_MANAGER_DEFAULT_BOOT_MODE || "ap"),
            inLan: false,
            apNamePrefix: "Smart-Kiln_",
            wifi: {
                countryCode: null,
                ssid: null,
                password: null,
            },
            ap: {
                countryCode: (process.env.WIFI_MANAGER_AP_COUNTRY_CODE || "US"),
                ssid: (process.env.WIFI_MANAGER_AP_SSID || "Smart-Kiln_Setup"),
                password: (process.env.WIFI_MANAGER_AP_PASSWORD || "smartkiln"),
            },
        }

        this.options = {
            fsState: {
                recurrentUpdateLimit: null,
                options: {
                    include: [
                        {
                            key: "mode"
                        },
                        {
                            key: "defaultBootMode"
                        },
                        {
                            key: "isFirstBoot"
                        },
                        {
                            key: "apNamePrefix"
                        },
                        {
                            key: "wifi"
                        },
                        {
                            key: "ap"
                        }
                    ]
                }
            }
        }

        // reserve key
        this.interval = null
    }

    startInterval(){
        clearInterval(this.interval)
        let intervalSeconds = process.env.WIFI_MANAGER_INTERVAL_SECONDS
        intervalSeconds = parseInt(intervalSeconds)
        if (isNaN(intervalSeconds)) intervalSeconds = 15

        this.interval = setInterval(()=>{
            if (this.state.mode === "wlan"){

                wifiHelper.getCurrentConnection().then((connection)=>{
                    if (!connection){
                        this.stopInterval()
                        this.setState({
                            mode: "ap"
                        })
                    }
                })

            } else {

                wifiHelper.getWifiNames().then((names)=>{
                    if (names.includes(this.state.wifi.ssid)){
                        this.stopInterval()
                        this.setState({
                            mode: "wlan"
                        })
                    }
                })

            }
        }, intervalSeconds * 1000)
    }

    stopInterval(){
        clearInterval(this.interval)
    }

    componentWillMount(){

        this.startInterval()

        this.stateChanged.on("wifi", (wifi)=>{
            wifiHelper.setWifi(wifi)
            .then(()=>{
            })
            .catch(console.log)
        })
        this.stateChanged.on("ap", (ap)=>{
            wifiHelper.setAP(ap)
            .then(()=>{
            })
            .catch(console.log)
        })
        this.stateChanged.on("defaultBootMode", (defaultBootMode)=>{
            wifiHelper.setDefaultBootMode(defaultBootMode)
            .then(()=>{
            })
            .catch(console.log)
        })
        this.stateChanged.on("mode", (mode)=>{
            if (mode === "wlan"){
                wifiHelper.switchToWifi()
                .then(()=>{
                    setTimeout(()=>{
                        this.startInterval()
                    }, 10*1000)
                })
                .catch(console.log)
            } else {
                wifiHelper.switchToAP()
                .then(()=>{
                })
                .catch(console.log)
            }
        })

        this.globalChanged.on("Authentication.socketIsAuthenticated", (socketIsAuthenticated)=>{
            if (socketIsAuthenticated){
                this.stopInterval()
            } else {
                this.startInterval()
            }
        })

        this.globalChanged.on("Authentication.account", (account)=>{

            if (account.name && typeof account.name === typeof "" && !account.name.includes(" ") && (account.name.length + this.state.apNamePrefix.length <= 30)){
                this.setState({
                    ap: {
                        countryCode: this.state.ap.countryCode,
                        ssid: `${this.state.apNamePrefix}${account.name}`,
                        password: this.state.ap.password,
                    }
                })
            }
        })

        this.global.io.on("connection", (socket)=>{
            socket.on("set-wifi-credentials", (data, cb)=>{

                let config = {...this.state.wifi}
                Object.keys(this.state.wifi).forEach((key)=>{

                    let value = data[key]

                    if (key === "countryCode"){
                        if (value && typeof value === typeof "" && !value.includes(" ")){
                            config[key] = value
                        }
                    } else if (key === "ssid"){
                        if (value && typeof value === typeof "" && !value.includes(" ")){
                            config[key] = value
                        }
                    } else if (key === "password"){
                        if (value && (typeof value === typeof "" || typeof value === "number")){
                            config[key] = value
                        }
                    }
                })

                this.setState({
                    wifi: config,
                    mode: "wlan",
                    defaultBootMode: "wlan"
                })
            })

            socket.on("switch-to-ap", ()=>{
                this.setState({
                    mode: "ap"
                })
            })
        })
    }
}