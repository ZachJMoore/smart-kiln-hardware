const { Components } = require("passeljs");
const mdns = require("mdns");
const helpers = require("../../lib/helpers.js");

module.exports = class ZeroConf extends Components.Base {
  constructor(props) {
    super(props);

    this.state = {
      isAdvertising: false,
      advertisementError: null
    };

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
    };
  }

  componentWillMount() {}

  componentDidMount() {
    let uuid = this.global.Authentication.account
      ? this.global.Authentication.account.uuid
      : null;

    let id = this.global.Authentication.account
      ? this.global.Authentication.account.id
      : null;

    let options = {
      name: `smart-kiln-${uuid}`,
      txtRecord: {
        sn: this.global.Authentication.account
          ? this.global.Authentication.account.name
            ? this.global.Authentication.account.name
            : "Unnamed Kiln"
          : "Unnamed Kiln",
        uuid: uuid,
        id: id,
        skdm: process.env.SMART_KILN_DEVICE_MODEL,
        rbv: process.env.RELAY_BOARD_VERSION,
        tsv: process.env.THERMO_SENSOR_VERSION
      }
    };

    let ad = mdns.createAdvertisement(
      new mdns.ServiceType("smart-kiln", "tcp"),
      8009,
      options,
      (error, service) => {
        if (error) {
          this.setState({
            advertisementError: error
          });
        } else {
          this.setState({
            isAdvertising: true,
            advertisementError: null
          });
        }
      }
    );

    ad.start();
  }
};
