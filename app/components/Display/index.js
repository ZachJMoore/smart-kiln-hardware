const { Components } = require("passeljs");
const Segments = require("./lib/ht16k33").Segments;
const { getTemperature, resolveObjectPath } = require("../../lib/helpers");

class Display extends Components.Base {
  constructor(props) {
    super(props);

    this.display = new Segments(0x70, 1);
    this.display.setBrightness(1);
  }

  componentDidMount() {
    let temperatureDisplayType = "fahrenheit";
    let tdt = resolveObjectPath(
      ".Authentication.account.kiln_settings.temperature_display_type",
      this.global
    );

    if (tdt && typeof tdt === typeof "text") temperatureDisplayType = tdt;

    this.globalChanged.on("Kiln.thermoSensor", thermoSensor => {
      this.display.writeNumber(
        getTemperature(thermoSensor.average, temperatureDisplayType)
      );
    });

    this.globalChanged.on("Authentication.account", account => {
      this.display.writeNumber(
        getTemperature(
          this.global.Kiln.thermoSensor.average,
          account.kiln_settings
            ? account.kiln_settings.temperature_display_type || "fahrenheit"
            : "fahrenheit"
        )
      );
    });
  }
}

module.exports = Display;
