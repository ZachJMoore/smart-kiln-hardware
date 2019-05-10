"use strict";

const Backpack = require("./backpack");
const fonts = require("./14-segments-fonts");

class Segments {
  constructor(address = 0x70, bus = 1) {
    this.display = new Backpack(address, bus);
    this.digits = fonts;
  }

  stringToCharArray(str) {
    // get special characters
    const charArray = [];
    const specialCharMatch = str.match(/#(.*?)_/g);
    let specialCharIndex = 0;

    for (let i = 0; i < str.length; i++) {
      if (
        specialCharMatch != null &&
        specialCharMatch.length > 0 &&
        str[i] === "#"
      ) {
        const char = specialCharMatch[specialCharIndex];
        const digitBinary = this.digits[char];

        if (digitBinary != undefined) {
          charArray.push(char);
          i += char.length - 1;
        } else {
          charArray.push(str[i]);
        }
        specialCharIndex++;
      } else {
        charArray.push(str[i]);
      }
    }
    return charArray;
  }

  stringToBinary(str) {
    //get chars
    const chars = this.stringToCharArray(str);

    //get binaries
    const binaries = [];
    chars.forEach((char, index) => {
      const binary = this.digits[char];
      if (binary !== undefined && binary !== null) {
        if (char == "." && index > 0) binaries[index - 1] |= this.digits["."];
        else binaries.push(binary);
      }
    });
    return binaries;
  }

  writeString(str) {
    this.display.clear();
    const binaries = this.stringToBinary(str);
    binaries.forEach((item, index) => {
      this.display.setBufferRow(index, item, false);
    });
    this.display.writeDisplay();
  }

  writeNumber(num) {
    this.display.clear();
    const str = num.toString();
    const binaries = this.stringToBinary(str);
    const offset = 4 - binaries.length;
    binaries.forEach((item, index) => {
      this.display.setBufferRow(index + offset, item, false);
    });
    this.display.writeDisplay();
  }

  writeChar(charNumber, char) {
    if (charNumber > 3) return;
    this.display.setBufferRow(charNumber, this.digits[char]);
  }

  writeRaw(charNumber, value) {
    //Sets a digit using the raw 16-bit value"
    if (charNumber > 3) return;
    //Set the appropriate digit
    this.display.setBufferRow(charNumber, value);
  }

  setBrightness(brightness) {
    this.display.setBrightness(brightness);
  }

  clear() {
    if (this.interval !== undefined) clearInterval(this.interval);
    this.display.clear();
  }
}

module.exports = Segments;
