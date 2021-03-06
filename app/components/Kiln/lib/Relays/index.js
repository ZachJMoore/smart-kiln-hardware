// handles all relays. Makes for an extendable system for different relay types

const helpers = require("../../../../lib/helpers.js");

class Relays {
  constructor(relayType = "v1", debug = false) {
    this.debug = debug;
    this.relayType = relayType;

    this.Gpio = require("onoff").Gpio;
    if (relayType === "v1") {
      this.relays = [new this.Gpio(27, "out")];
    } else if (relayType === "v2") {
      this.relays = [
        new this.Gpio(5, "out"),
        new this.Gpio(6, "out"),
        new this.Gpio(13, "out"),
        new this.Gpio(19, "out"),
        new this.Gpio(26, "out"),
        new this.Gpio(17, "out"),
        new this.Gpio(27, "out"),
        new this.Gpio(22, "out")
      ];
    } else if (relayType === "v3") {
      this.relays = [
        new this.Gpio(6, "out"),
        new this.Gpio(13, "out"),
        new this.Gpio(19, "out"),
        new this.Gpio(26, "out")
      ];
    } else if (relayType === "v4") {
      this.relays = [
        new this.Gpio(13, "out"),
        new this.Gpio(19, "out"),
        new this.Gpio(26, "out"),
        new this.Gpio(16, "out"),
        new this.Gpio(20, "out"),
        new this.Gpio(21, "out")
      ];
    } else {
      throw new Error(
        "No valid relay type provided to constructor. There will be no way to turn on the kiln"
      );
    }
  }

  setRelays(value) {
    if (
      this.relayType === "v1" ||
      this.relayType === "v3" ||
      this.relayType === "v4"
    ) {
      if (typeof value === "number") {
        this.relays.forEach(relay => {
          relay.writeSync(value);
        });
      }
    } else if (this.relayType === "v2") {
      if (typeof value === "number") {
        if (value === 1) value = 0;
        else value = 1;

        this.relays.forEach(relay => {
          relay.writeSync(value);
        });
      }
    }
  }

  checkRelays() {
    let isOn = false;
    let isOnCount = 0;
    let relays = [];

    this.relays.forEach(relay => {
      if (relay.readSync() === 1) {
        isOn = true;
        isOnCount++;
        relays.push({
          isOn: true
        });
      } else {
        relays.push({
          isOn: false
        });
      }
    });

    return {
      isOn,
      isOnCount,
      relays
    };
  }
}

module.exports = Relays;
