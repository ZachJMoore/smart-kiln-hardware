const _  = require("lodash")
const jetpack = require("fs-jetpack")
const util = require('util')
const exec = util.promisify(require('child_process').exec);

const isDebug = process.env.DEBUG === "true"

const _writeTemplate = async (templatePath, filePath, properties)=>{
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

const setAP = async (props)=>{

    let config = {
        ap_country_code: (props.countryCode && typeof props.countryCode === typeof "") ? props.countryCode : "US",
        ap_ssid: (props.ssid && typeof props.ssid === typeof "") ? props.ssid : "Smart-Kiln-Setup-AP",
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
    return exec("sudo systemctl start wpa_supplicant@ap0.service")
}

const switchToWifi = ()=>{
    return exec("sudo systemctl start wpa_supplicant@wlan0.service")
}

const setupSDND = async (props)=>{
    isDebug && console.log("Setting up 'systemd-networkd' and writing appropriate files and permissions.")
    isDebug && console.log("Enable persistent journaling, useful for troubleshooting.")
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
        isDebug && console.log("Disable wlan0 for initial setup.")
        return exec("sudo systemctl disable wpa_supplicant@wlan0.service")
    })
    .then(()=>{
        isDebug && console.log("Enable ap for initial setup.")
        return exec("sudo systemctl enable wpa_supplicant@ap0.service")
    })
    .then(()=>{
        console.log(`'systemd-networkd' setup complete. A reboot is needed. Once restarted, the device will be in access point mode with ssid '${(props.ap.ssid && typeof props.ap.ssid === typeof "") ? props.ap.ssid : "Smart-Kiln-Setup-AP"}' and password '${(props.ap.password && typeof props.ap.password === typeof "") ? props.ap.password : "smartkiln"}'`)
        return Promise.resolve("'systemd-networkd' setup complete")
    })
}

const reboot = async ()=>{
    return exec("sudo reboot")
}

module.exports = {
    setAP,
    setWifi,
    switchToAP,
    switchToWifi,
    setDefaultBootMode,
    setupSDND,
    reboot
}