const fs = require("fs");
const ROOT_PATH = fs.realpathSync(".");
require("dotenv").config({
  path: ROOT_PATH + "/.env"
});
require("dotenv").config();
const wifiHelper = require("../app/components/WifiManager/lib/wifiHelper.js");

const wifiConfig = {
  wlan: {
    countryCode: process.env.WIFI_MANAGER_WIFI_COUNTRY_CODE || "US",
    ssid: process.env.WIFI_MANAGER_WIFI_SSID || "smart-kiln-setup",
    password: process.env.WIFI_MANAGER_WIFI_PASSWORD || "smartkiln"
  },
  ap: {
    countryCode: "US",
    ssid: "smart-kiln-ap",
    password: "smartkiln"
  }
};

Promise.all([
  wifiHelper.setupSDND(wifiConfig)
  //TODO: add complete setup process steps. Install dependencies, system and npm.
])
  .then(success => {
    console.log(new Date() + ": " + success);
    console.log(
      new Date() +
        ": " +
        "Everything setup! Please read the above output and ensure there are no other necessary steps that need to be taken before running."
    );
  })
  .catch(error => {
    console.log(new Date() + ": " + "Something went wrong during setup");
    console.log(new Date() + ": " + error);
    console.log(
      new Date() +
        ": " +
        "Things will need to be investigated and possibly setup manually. Please read the above output to determine the cause of failure."
    );
  });
