const { Components } = require("passeljs");
const wifiHelper = require("./lib/wifiHelper.js");

module.exports = class WifiManager extends Components.Base {
  constructor(props) {
    super(props);

    this.state = {
      mode: "ap",
      defaultBootMode: "ap", // "ap" || "wlan"
      apNamePrefix: "smart-kiln-",
      wlan: {
        countryCode: null,
        ssid: null,
        password: null
      },
      ap: {
        countryCode: "US",
        ssid: "smart-kiln-ap",
        password: "smartkiln"
      }
    };

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
              key: "apNamePrefix"
            },
            {
              key: "wlan"
            },
            {
              key: "ap"
            }
          ]
        }
      }
    };

    // reserve key
    this.interval = null;
  }

  startInterval() {
    clearInterval(this.interval);
    let intervalSeconds = this.global.RemoteConfig
      .WIFI_MANAGER_INTERVAL_SECONDS;
    intervalSeconds = parseInt(intervalSeconds);
    if (isNaN(intervalSeconds)) intervalSeconds = 15;

    // TODO: when the interval seconds change, make sure we reset things
    this.interval = setInterval(() => {
      if (this.state.mode === "wlan") {
        wifiHelper.getCurrentConnection().then(connection => {
          if (!connection) {
            this.stopInterval();
            this.setState({
              mode: "ap"
            });
          }
        });
      } else {
        wifiHelper.getWifiNames().then(names => {
          if (names.includes(this.state.wlan.ssid)) {
            this.stopInterval();
            this.setState({
              mode: "wlan"
            });
          }
        });
      }
    }, intervalSeconds * 1000);
  }

  stopInterval() {
    clearInterval(this.interval);
  }

  componentWillMount() {
    this.startInterval();

    this.stateChanged.on("wlan", wlan => {
      wifiHelper
        .setWifi(wlan)
        .then(() => {})
        .catch(error => {
          console.log(new Date() + ": " + error);
        });
    });
    this.stateChanged.on("ap", ap => {
      wifiHelper
        .setAP(ap)
        .then(() => {})
        .catch(error => {
          console.log(new Date() + ": " + error);
        });
    });
    this.stateChanged.on("defaultBootMode", defaultBootMode => {
      wifiHelper
        .setDefaultBootMode(defaultBootMode)
        .then(() => {})
        .catch(error => {
          console.log(new Date() + ": " + error);
        });
    });
    this.stateChanged.on("mode", mode => {
      if (mode === "wlan") {
        wifiHelper
          .switchToWifi()
          .then(() => {
            setTimeout(() => {
              this.startInterval();
            }, 10 * 1000);
          })
          .catch(error => {
            console.log(new Date() + ": " + error);
          });
      } else {
        wifiHelper
          .switchToAP()
          .then(() => {})
          .catch(error => {
            console.log(new Date() + ": " + error);
          });
      }
    });

    this.globalChanged.on(
      "Authentication.socketIsAuthenticated",
      socketIsAuthenticated => {
        if (socketIsAuthenticated) {
          this.stopInterval();
        } else {
          this.startInterval();
        }
      }
    );

    this.globalChanged.on("Authentication.account", account => {
      if (
        account.name &&
        typeof account.name === typeof "" &&
        !account.name.includes(" ") &&
        account.name.length + this.state.apNamePrefix.length <= 30
      ) {
        this.setState({
          ap: {
            countryCode: this.state.ap.countryCode,
            ssid: `${this.state.apNamePrefix}${account.name}`,
            password: this.state.ap.password
          }
        });
      }
    });

    this.global.io.on("connection", socket => {
      socket.on("set-wifi-credentials", (data, cb) => {
        let config = { ...this.state.wlan };
        Object.keys(this.state.wlan).forEach(key => {
          let value = data[key];

          if (key === "countryCode") {
            if (value && typeof value === typeof "") {
              config[key] = value;
            }
          } else if (key === "ssid") {
            if (value && typeof value === typeof "") {
              config[key] = value;
            }
          } else if (key === "password") {
            if (
              value &&
              (typeof value === typeof "" || typeof value === "number")
            ) {
              config[key] = value;
            }
          }
        });

        this.setState({
          wlan: config,
          mode: "wlan",
          defaultBootMode: "wlan"
        });
      });

      socket.on("switch-to-ap", () => {
        this.setState({
          mode: "ap"
        });
      });
    });
  }

  componentDidMount() {
    wifiHelper
      .setAP(this.state.ap)
      .then(() => {})
      .catch(error => {
        console.log(new Date() + ": " + error);
      });
  }
};
