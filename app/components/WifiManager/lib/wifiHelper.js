const _  = require("lodash")
const jetpack = require("fs-jetpack")
const util = require('util')
const exec = util.promisify(require('child_process').exec);

const isValidPlatform = (process.platform === "linux" && process.arch === "arm")
const useFakeData = (process.env.FAKE_DATA === "true")

let isDebug = (process.env.DEBUG === "true")

const _writeTemplate = async (templatePath, filePath, properties)=>{
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)
    return jetpack.readAsync(__dirname + templatePath, "utf8")
            .then((data)=>{
                if (data){

                    if (!properties) properties = {}
                    const compiled = _.template(data);
                    const configuredTemplate = compiled(properties)

                    isDebug && console.log(`Writing a template to '${filePath}'`)
                    return jetpack.writeAsync(filePath, configuredTemplate, {
                        atomic: true
                    })

                }
            })
}

const getWifiNames = async ()=>{

    if (useFakeData) return Promise.resolve([process.env.WIFI_MANAGER_WIFI_SSID])
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    // TODO: switch out for sudo iw dev wlan0 scan ap-force
    return exec("sudo iwlist wlan0 scan | grep -e ESSID").then((object)=>{

        // set names from terminal output
        let names = object.stdout
        names = names.split("\n")

        // normalize names
        let nn = names.map((name)=>{
            return name.slice(name.indexOf("ESSID:") + 7, name.length-1)
        }).filter((name)=>{
            if (!name || name === "" || name.includes("\\x00\\x00")) return false
            else return true
        })

        // return promise
        return Promise.resolve(nn)
    })
}

const getCurrentConnection = async ()=>{

    if (useFakeData) return Promise.resolve(process.env.WIFI_MANAGER_WIFI_SSID)
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    return exec("iwgetid").then(object=>{

        let lines = object.stdout.split("\n")
        if (lines.length === 0) return Promise.resolve(null)
        else {
            let text = lines[0]
            let nt = text.slice(text.indexOf("ESSID:") + 7, text.length-1)
            return Promise.resolve(nt)
        }
    })
    .catch(error=>{
        return Promise.resolve(null)
    })
}

const setAP = async (props)=>{

    if (useFakeData) return Promise.resolve("access point credentials are set (fake data is on)")
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    let config = {
        ap_country_code: (props.countryCode && typeof props.countryCode === typeof "") ? props.countryCode : "US",
        ap_ssid: (props.ssid && typeof props.ssid === typeof "") ? props.ssid : "Smart-Kiln_Setup",
        ap_password: (props.password && typeof props.password === typeof "") ? props.password : "smartkiln",
    }
    return _writeTemplate(
        "/templates/wpa_supplicant-ap0.conf.template",
        "/etc/wpa_supplicant/wpa_supplicant-ap0.conf",
        config
    ).then(()=>{
        isDebug && console.log("Set chmod 600 permissions for access point wpa_supplicant.")
        return exec("sudo chmod 600 /etc/wpa_supplicant/wpa_supplicant-ap0.conf")
    })
}

const setWifi = async (props)=>{

    if (useFakeData) return Promise.resolve("wifi credentials set (fake data is on)")
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    let config = {
        wifi_country_code: (props.countryCode && typeof props.countryCode === typeof "") ? props.countryCode : "US",
        wifi_ssid: (props.ssid && typeof props.ssid === typeof "") ? props.ssid : "smart-kiln-setup",
        wifi_password: (props.password && typeof props.password === typeof "") ? props.password : "smartkiln",
    }
    return _writeTemplate(
        "/templates/wpa_supplicant-wlan0.conf.template",
        "/etc/wpa_supplicant/wpa_supplicant-wlan0.conf",
        config
    ).then(()=>{
        isDebug && console.log("Set chmod 600 permissions for wpa_supplicant.")
        return exec("sudo chmod 600 /etc/wpa_supplicant/wpa_supplicant-wlan0.conf")
    })

}

const setDefaultBootMode = async (defaultMode = "wlan") => {

    if (useFakeData) return Promise.resolve("default boot mode is set (fake data is on)")
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    if (defaultMode === "wlan"){
        return Promise.all([
            exec("sudo systemctl enable wpa_supplicant@wlan0.service"),
            exec("sudo systemctl disable wpa_supplicant@ap0.service")
        ])
    } else {
        return Promise.all([
            exec("sudo systemctl disable wpa_supplicant@wlan0.service"),
            exec("sudo systemctl enable wpa_supplicant@ap0.service")
        ])
    }

}

const switchToAP = ()=>{

    if (useFakeData) return Promise.resolve("switched to access point (fake data is on)")
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    return exec("sudo systemctl start wpa_supplicant@ap0.service")
}

const switchToWifi = ()=>{

    if (useFakeData) return Promise.resolve("switched to wifi (fake data is on)")
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    return exec("sudo systemctl start wpa_supplicant@wlan0.service")
}

const setDebug = (debug = false) => {
    if (debug) isDebug = true
    else isDebug = false
}

const setupSDND = async (props)=>{

    if (useFakeData) return Promise.resolve("systemd-networkd' setup complete (fake data is on)")
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    isDebug && console.log("Setting up 'systemd-networkd' and writing appropriate files and permissions.")
    isDebug && console.log("Enable persistent journaling, useful for troubleshooting.")

    // TODO: Catch all errors an decide which ones to exit on.
    // TODO: Check whether setup has been ran before
    return exec("sudo mkdir -p /var/log/journal")
    .then(()=>{
        return exec("sudo systemd-tmpfiles --create --prefix /var/log/journal")
    })
    // .then(()=>{
    //     isDebug && console.log("Install little helper 'rng-tools' with apt install.")
    //     return exec("sudo apt install rng-tools")
    // })
    .then(()=>{
        isDebug && console.log("Disable debian networking and dhcpcd.")
        return exec("sudo systemctl mask networking.service")
    })
    .then(()=>{
        return exec("sudo systemctl mask dhcpcd.service")
    })
    .then(()=>{
        return exec("sudo mv /etc/network/interfaces /etc/network/interfaces~")
        .then((data)=>{
            return Promise.resolve(data)
        })
        .catch((error)=>{
            // assume that /etc/network/interfaces doesn't exist and that we can safely ignore it.
            return Promise.resolve()
        })
    })
    .then(()=>{
        return exec("sudo sed -i '1i resolvconf=NO' /etc/resolvconf.conf")
    })
    .then(()=>{
        isDebug && console.log("Enable systemd-networkd.")
        return exec("sudo systemctl enable systemd-networkd.service")
    })
    .then(()=>{
        return exec("sudo systemctl enable systemd-resolved.service")
    })
    .then(()=>{
        return exec("sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf")
    })
    .then(()=>{
        isDebug && console.log("Setup wpa_supplicant and enable it.")
        return setWifi(props.wifi)
    })
    .then(()=>{
        isDebug && console.log("Switch spa_supplicant services.")
        return exec("sudo systemctl disable wpa_supplicant.service")
    })
    .then(()=>{
        return exec("sudo systemctl enable wpa_supplicant@wlan0.service")
    })
    .then(()=>{
        isDebug && console.log("Setup access point wpa_supplicant and enable it.")
        return setAP(props.ap)
    })
    .then(()=>{
        isDebug && console.log("Configure 08-wlan0.network.")
        return _writeTemplate(
            "/templates/08-wlan0.network.template",
            "/etc/systemd/network/08-wlan0.network",
            null
        )
    })
    .then(()=>{
        isDebug && console.log("Configure 12-ap0.network.")
        return _writeTemplate(
            "/templates/12-ap0.network.template",
            "/etc/systemd/network/12-ap0.network",
            null
        )
    })
    .then(()=>{
        return exec("sudo systemctl disable wpa_supplicant@ap0.service.")
    })
    .then(()=>{
        isDebug && console.log("Configure wpa_supplicant@ap0.service.")
        return _writeTemplate(
            "/templates/wpa_supplicant@ap0.service.template",
            "/etc/systemd/system/wpa_supplicant@ap0.service",
            null
        )
    })
    .then(()=>{
        let mode = (process.env.WIFI_MANAGER_DEFAULT_BOOT_MODE || "ap")
        isDebug && console.log(`Set default boot mode to '${mode}' mode.`)
        return setDefaultBootMode(mode)
    })
    .then(()=>{
        console.log(`'systemd-networkd' setup complete. A reboot is needed. Once restarted, the device will be in access point mode with ssid '${(props.ap.ssid && typeof props.ap.ssid === typeof "") ? props.ap.ssid : "Smart-Kiln_Setup"}' and password '${(props.ap.password && typeof props.ap.password === typeof "") ? props.ap.password : "smartkiln"}'`)
        return Promise.resolve("'systemd-networkd' setup complete")
    })
}

const reboot = async ()=>{

    if (useFakeData) return Promise.reject("You are using fake data. No promise would normally be returned. We can assume this will in essence always be rejected.")
    if (!isValidPlatform) return Promise.reject(`Platform '${process.platform}' with architecture '${process.arch}' is not a valid device of deployment. Must be a Linux Arm device`)

    return exec("sudo reboot")
}

module.exports = {
    switchToAP,
    switchToWifi,
    setWifi,
    setAP,
    setDefaultBootMode,
    setDebug,
    setupSDND,
    getWifiNames,
    getCurrentConnection,
    reboot
}