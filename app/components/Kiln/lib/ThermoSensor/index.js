// handles all thermocouples. Makes for an extendable system for different sensor types

const helpers = require("../../../../lib/helpers.js");
const { global } = require("passeljs");

module.exports = class ThermoSensor {
  constructor(sensorType = "v1", debug = false) {
    this.debug = debug;
    this.sensorType = sensorType;

    if (!helpers.isValidPlatform()) {
      this.sensors = [];
    } else {
      const Max31855 = require("./lib/Max31855.js");
      if (sensorType === "v1") {
        this.sensors = [new Max31855(null, this.debug)];
      } else if (sensorType === "v2") {
        this.sensors = [
          new Max31855(23, this.debug),
          new Max31855(24, this.debug)
        ];
      } else {
        throw new Error(
          "No valid sensor type provided to constructor. No interface library will be loaded"
        );
      }
    }
  }

  async readCelsiusAsync() {
    return new Promise(async (resolve, reject) => {
      const data = [];
      for (let i = 0; i < this.sensors.length; i++) {
        const sensor = this.sensors[i];
        const temperature = await sensor.readTempC();
        data.push({
          temperature,
          chipSelectNumber: sensor.chipSelectNumber || null
        });
      }

      let hasValidReading = false;
      let hasValidReadingCount = 0;
      let average = 0;
      let sensors = [];

      let temperatureOffset = 0;

      let tf = helpers.resolveObjectPath(
        "Authentication.account.kiln_settings.temperature_offset",
        global
      );

      if (tf && typeof tf === "number") temperatureOffset = tf;

      data.map(({ temperature, chipSelectNumber }) => {
        if (!isNaN(temperature)) {
          temperature =
            temperature + helpers.fahrenheitToCelsius(temperatureOffset);
          hasValidReading = true;
          hasValidReadingCount++;
          average += temperature;
          sensors.push({
            chipSelectNumber,
            hasValidReading: true,
            temperature
          });
        } else {
          sensors.push({
            chipSelectNumber,
            hasValidReading: false,
            temperature: null
          });
        }
      });

      if (!hasValidReading)
        return reject(new Error("No valid readings from thermocouple(s)"));
      else
        return resolve({
          hasValidReading,
          hasValidReadingCount,
          average: average / hasValidReadingCount,
          sensors
        });
    });
  }

  async readFahrenheitAsync() {
    return this.readCelsiusAsync().then(status => {
      (status.average = helpers.celsiusToFahrenheit(status.average)),
        (status.sensors = status.sensors.map(object => {
          object.temperature = helpers.celsiusToFahrenheit(object.temperature);
          return object;
        }));
      return Promise.resolve(status);
    });
  }
};
