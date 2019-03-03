const { Components } = require("passeljs")
const jetpack = require("fs-jetpack")
const fs = require("fs")
const ROOT_PATH = fs.realpathSync('.')

module.exports = class AccessPointController extends Components.WithStore{
    constructor(props){
        super(props)

        this.state = {
            isAccessPoint: false,
            absoluteHostTemplatePath: `${ROOT_PATH}/app/components/AccessPointController/lib/templates/`,
            absoluteCustomizedHostTemplatePath: `${ROOT_PATH}/app/storage/public/AccessPointController/templates/`,
            absoluteClientTemplatePath: `${ROOT_PATH}/app/components/AccessPointController/lib/templates/defaults`,
            files: [
                {
                    absoluteToPath: "/etc/",
                    fileName: "dhcpcd",
                    fileExtension: ".conf",
                },
                {
                    absoluteToPath: "/etc/network/",
                    fileName: "interfaces",
                    fileExtension: "",
                },
                {
                    absoluteToPath: "/etc/hostapd/",
                    fileName: "hostapd",
                    fileExtension: ".conf",
                },
                {
                    absoluteToPath: "/etc/default/",
                    fileName: "hostapd",
                    fileExtension: "",
                },
                {
                    absoluteToPath: "/etc/",
                    fileName: "dnsmasq",
                    fileExtension: ".conf",
                },
            ]
        }
    }

    componentWillMount(){

        class FileStore extends this.getFileStore(){
            constructor(props){
                super(props)
            }
        }

        this.fileStore = new FileStore()

        if (process.arch === "arm" && process.env.FAKE_DATA === "false"){

            // const util = require('util');
            // const exec = util.promisify(require('child_process').exec);

            // async function ls() {
            // const { stdout, stderr } = await exec('cd app && ls');
            // console.log('stdout:', stdout);
            // console.log('stderr:', stderr);
            // }

            // ls();

            console.log(jetpack.read("/etc/network/interfaces"))
        }
    }
}