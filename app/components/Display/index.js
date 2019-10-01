const { Components } = require("passeljs");
const { getTemperature, resolveObjectPath } = require("../../lib/helpers");

const useFakeData = process.env.FAKE_DATA === "true";

class Display extends Components.Base {
  constructor(props) {
    super(props);

    if (useFakeData) return;

    const Segments = require("./lib/ht16k33").Segments;

    const display = new Segments(0x70, 1);
    display.setBrightness(1);

    const clear = () => {
      display.clear();
    };
    process.on("SIGINT", function() {
      clear();
      process.nextTick(function() {
        process.exit(0);
      });
    });
    process.on("exit", clear);
    process.on("uncaughtException", clear);

    this.display = display;
  }

  componentDidMount() {
    if (useFakeData) return;

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
