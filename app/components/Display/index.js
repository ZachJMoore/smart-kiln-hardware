const { Components } = require("passeljs");

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

    this.globalChanged.on("Kiln.thermoSensor", thermoSensor => {
      this.display.writeNumber(thermoSensor.average.toFixed(0));
    });
  }
}

module.exports = Display;
