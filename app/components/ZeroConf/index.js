// Handles setting ZeroConf up and all the variables and meta data to be advertised. Not extremely useful. Waiting on local setup from mobile app to be implemented.

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

    this.advertisement = null;
    this.options = {
      name: null,
      txtRecord: {
        sn: null,
        uuid: null,
        user_id: null,
        id: null,
        skdm: null,
        rbv: null,
        tsv: null
      }
    };
  }

  _createAdvertisement() {
    const uuid = this.global.Authentication.account
      ? this.global.Authentication.account.uuid
      : null;

    const user_id = this.global.Authentication.account
      ? this.global.Authentication.account.user_id
      : null;

    const id = this.global.Authentication.account
      ? this.global.Authentication.account.id
      : null;

    const options = {
      name: `${uuid}`,
      txtRecord: {
        name: this.global.Authentication.account
          ? this.global.Authentication.account.name
            ? this.global.Authentication.account.name
            : "Unnamed Kiln"
          : "Unnamed Kiln",
        uuid: uuid,
        id: id,
        user_id: user_id,
        software_v: helpers.getSoftwareVersion(),
        model_v: process.env.SMART_KILN_DEVICE_MODEL,
        relay_v: process.env.RELAY_BOARD_VERSION,
        thermo_v: process.env.THERMO_SENSOR_VERSION
      }
    };

    this.options = options;

    const ad = mdns.createAdvertisement(
      new mdns.ServiceType("smart-kiln", "tcp"),
      parseInt(process.env.LOCAL_PORT),
      options,
      (error, service) => {
        if (error) {
          this.setState({
            isAdvertising: false,
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

    return ad;
  }

  _stopAdvertisement() {
    if (this.advertisement) this.advertisement.stop();

    this.setState({
      isAdvertising: false,
      advertisementError: null
    });
  }

  _startAdvertisement() {
    this.advertisement = this._createAdvertisement();
    this.advertisement.start();
  }

  advertise() {
    this._stopAdvertisement();
    this._startAdvertisement();
  }

  componentWillMount() {}

  componentDidMount() {
    this.advertise();

    this.globalChanged.on("Authentication.account", account => {
      if (
        account.name !== this.options.txtRecord.sn ||
        account.uuid !== this.options.txtRecord.uuid ||
        account.user_id !== this.options.txtRecord.user_id ||
        account.id !== this.options.txtRecord.id
      ) {
        this.advertise();
      }
    });
  }
};
