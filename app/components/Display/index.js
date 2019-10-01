// handles all display content and/or interactions

const { Components } = require("passeljs");
const Segments = require("./lib/ht16k33").Segments;
const { getTemperature, resolveObjectPath } = require("../../lib/helpers");

class Display extends Components.Base {
  constructor(props) {
    super(props);

    this.display = new Segments(0x70, 1);
    this.display.setBrightness(1);
  }

  getTemperatureDisplayType(path, object) {
    let temperatureDisplayType = "fahrenheit";

    let resolvePath = path;
    let objectToResolve = object;

    if (!object || !path) {
      resolvePath =
        "Authentication.account.kiln_settings.temperature_display_type";
      objectToResolve = this.global;
    }

    let tdt = resolveObjectPath(resolvePath, objectToResolve);

    if (tdt) temperatureDisplayType = tdt;

    return temperatureDisplayType;
  }

  componentDidMount() {
    this.globalChanged.on("Kiln.thermoSensor", thermoSensor => {
      let temperature = getTemperature(
        thermoSensor.average,
        this.getTemperatureDisplayType()
      );

      this.display.writeNumber(temperature);
    });

    this.globalChanged.on("Authentication.account", account => {
      let temperature = getTemperature(
        this.global.Kiln.thermoSensor.average,
        this.getTemperatureDisplayType(
          "kiln_settings.temperature_display_type",
          account
        )
      );

      this.display.writeNumber(temperature);
    });
  }
}

module.exports = Display;
