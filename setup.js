require("dotenv").config()
const wifiHelper = require("./app/components/WifiManager/lib/wifiHelper.js")

const wifiConfig = {
    wifi: {
        countryCode: (process.env.WIFI_MANAGER_WIFI_COUNTRY_CODE || "US"),
        ssid: (process.env.WIFI_MANAGER_WIFI_SSID || "smart-kiln-setup"),
        password: (process.env.WIFI_MANAGER_WIFI_PASSWORD || "smartkiln"),
    },
    ap: {
        countryCode: (process.env.WIFI_MANAGER_AP_COUNTRY_CODE || "US"),
        ssid: (process.env.WIFI_MANAGER_AP_SSID || "Smart-Kiln_Setup"),
        password: (process.env.WIFI_MANAGER_AP_PASSWORD || "smartkiln"),
    },

}

Promise.all([
    wifiHelper.setupSDND(wifiConfig)
]).then((success)=>{
    console.log(success)
    console.log("Everything setup! Please read the above output and ensure there are no other necessary steps that need to be taken before running.")
})
.catch((error)=>{
    console.log("Something went wrong during setup")
    console.log(error)
    console.log("Things will need to be investigated and possibly setup manually. Please read the above output to determine the cause of failure.")
})