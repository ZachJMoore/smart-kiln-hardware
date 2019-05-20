/**
 * Node.js module for driving the Adafruit MAX31855 thermocouple temperature amplifier on Raspberry Pi.
 *
 * Currently supports only hardware SPI configuration (as opposed to software SPI using GPIO pins).
 * Note: May require running under sudo for SPI permissions.
 * Note: The SPI master driver is disabled by default on Raspian Linux and must be enabled. see here:
 * https://www.raspberrypi.org/documentation/hardware/raspberrypi/spi/README.md
 */

var SPI = require("pi-spi");
const Gpio = require("onoff").Gpio;
let chipSelects = [];

const chipSelectReset = () => {
  chipSelects.forEach(cs => cs.writeSync(0));
};

function MAX31855(chipSelect = null, debug = false) {
  if (typeof chipSelect !== typeof 0) {
    if (chipSelect !== null)
      throw new Error(
        "The supplied gpio chip select output pin '${chipSelect}' is not a valid number"
      );
  }

  // Initialize the SPI settings
  this._spi = SPI.initialize("/dev/spidev0.0");
  this._spi.clockSpeed(5000000);
  this._spi.dataMode(0);
  this._spi.bitOrder(SPI.order.MSB_FIRST);
  this.chipSelectNumber = chipSelect;
  this.debug = debug;

  if (chipSelect !== null) {
    this.chipSelect = new Gpio(this.chipSelectNumber, "out");
    chipSelects.push(this.chipSelect);
  } else {
    if (chipSelects.length > 0) {
      throw new Error(
        "Mixed native spi chip select and bit bash chip select. Ensure you pass a gpio pin to new Max31855 constructors"
      );
    }
  }
}

/** Read 32 bits from the SPI bus. */
MAX31855.prototype._read32 = function(callback) {
  const self = this;
  this._spi.read(4, function(error, bytes) {
    if (error) {
      console.error(error);
    } else {
      if (!bytes || bytes.length != 4) {
        throw new Error(
          "MAX31855: Did not read expected number of bytes from device!"
        );
      } else {
        value =
          (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
        if (self.debug) console.log("Raw value: ", value);
        callback(value);
      }
    }
  });
};

/** Returns the internal temperature value in degrees Celsius. */
MAX31855.prototype.readInternalC = function(callback) {
  if (callback) {
    this._read32(function(value) {
      // Ignore bottom 4 bits of thermocouple data.
      value >>= 4;
      // Grab bottom 11 bits as internal temperature data.
      var internal = value & 0x7ff;
      if (value & 0x800) {
        // Negative value, take 2's compliment.
        internal = ~internal + 1;
      }
      // Scale by 0.0625 degrees C per bit and return value.
      callback(internal * 0.0625);
    });
  } else {
    console.log("MAX31855: Read request issued with no callback.");
  }
};

/** Return the thermocouple temperature value. Value is returned in degrees celsius */
MAX31855.prototype.readTempC = function() {
  return new Promise((resolve, reject) => {
    if (this.chipSelect) {
      chipSelectReset();
      this.chipSelect.writeSync(1);
    }
    var self = this; // Scope closure
    this._read32(function(value) {
      // Check for error reading value.
      if (value & 0x7) {
        resolve(NaN);
      } else {
        if (value & 0x80000000) {
          // Check if signed bit is set.
          // Negative value, shift the bits and take 2's compliment.
          value >>= 18;
          value = ~value + 1;
        } else {
          // Positive value, just shift the bits to get the value.
          value >>= 18;
        }
        // Scale by 0.25 degrees C per bit
        resolve(value * 0.25);
      }
    });
  });
};

module.exports = MAX31855;
