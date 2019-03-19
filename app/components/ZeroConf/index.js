const { Components } = require("passeljs")
const mdns = require("mdns")
const helpers = require("../../lib/helpers.js")

module.exports = class ZeroConf extends Components.Base{
    constructor(props){
        super(props)

        this.state = {
            isAdvertising: false,
            advertisementError: null
        }

        this.options = {
            globalState: {
                options: {
                    include: [
                        {
                            key: "isAdvertising",
                            emit: true
                        },
                        {
                            key: "advertisementError",
                            emit: true
                        }
                    ]
                }
            }
        }
    }

    componentWillMount(){

    }

    componentDidMount(){

        let uuid = this.global.Authentication.account ? this.global.Authentication.account.uuid : helpers.generateUUID()

        let options = {
            name: `Smart-Kiln-${uuid}`,
            txtRecord: {
                sn: (this.global.Authentication.account.name || "Smart Kiln"),
                uuid: uuid,
                skdm: process.env.SMART_KILN_DEVICE_MODEL,
                rbv: process.env.RELAY_BOARD_VERSION,
                tsv: process.env.THERMO_SENSOR_VERSION
            }
        }

        let ad = mdns.createAdvertisement(new mdns.ServiceType('smartkiln', 'tcp'), 8009, options, (error, service)=>{
            if (error) {
                this.setState({
                    advertisementError: error
                })
            } else {
                this.setState({
                    isAdvertising: true,
                    advertisementError: null
                })
            }
        })

        ad.start();
    }
}