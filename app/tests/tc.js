require("dotenv").config();
const ThermoSensor = require("../components/Kiln/lib/ThermoSensor");

const thermoSensor = new ThermoSensor(
  process.env.THERMO_SENSOR_VERSION || "v1"
);

thermoSensor
  .readFahrenheitAsync()
  .then(status => {
    console.log(status);
  })
  .catch(error => {
    console.log(error);
  });

const interval = setInterval(() => {
  thermoSensor
    .readFahrenheitAsync()
    .then(status => {
      console.log(status);
    })
    .catch(error => {
      console.log(error);
    });
}, 1000);
