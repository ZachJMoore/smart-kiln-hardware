const toFixed = (value, index = 0) => {
  return parseFloat(value.toFixed(index));
};

const celsiusToFahrenheit = value => {
  if (typeof value !== typeof 1) return value;
  return toFixed(value, 2) * 1.8 + 32;
};
const fahrenheitToCelsius = value => {
  if (typeof value !== typeof 1) return value;
  return (toFixed(value, 2) - 32) * (5 / 9);
};

const getTemperature = (
  temperature,
  displayType = "fahrenheit",
  reverse = false
) => {
  let nt = temperature;

  if (displayType === "celsius") {
    if (!reverse) nt = fahrenheitToCelsius(temperature);

    if (reverse) nt = celsiusToFahrenheit(temperature);
  }

  nt = toFixed(nt);

  return nt;
};

const getTemperatureText = (temperature, displayType = "fahrenheit") => {
  if (temperature === null) return "N/A";

  let nt = temperature;

  if (displayType === "celsius") {
    nt = fahrenheitToCelsius(temperature);
  }

  nt = toFixed(nt);

  return `${nt}º${displayType[0].toUpperCase()}`;
};

const addTemperatureSymbol = (temperature, displayType = "fahrenheit") => {
  return `${temperature}º${displayType[0].toUpperCase()}`;
};

const isError = e => {
  return (
    e &&
    e.stack &&
    e.message &&
    typeof e.stack === "string" &&
    typeof e.message === "string"
  );
};

const resolveObjectPath = (path, obj) => {
  if (Array.isArray(path)) path = path.join(".");
  return path.split(".").reduce(function(prev, curr) {
    return prev ? prev[curr] : null;
  }, obj);
};

const createObjectPath = (path, obj) => {
  if (Array.isArray(path)) path = path.join(".");
  return path.split(".").reduce(function(prev, curr) {
    return (prev[curr] = {});
  }, obj);
};

const convertNumberToLetters = number => {
  const l = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  const ns = number.toString().split("");
  let lts = "";

  ns.forEach(string => {
    lts += l[parseInt(string)];
  });

  return lts;
};

const convertLettersToNumber = letters => {
  const l = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9
  };
  let nb = [];

  letters.split("").forEach(letter => {
    nb.push(l[letter]);
  });

  return parseInt(nb.join(""));
};

const generateUUID = () => {
  var d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

module.exports = {
  toFixed,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  getTemperature,
  getTemperatureText,
  addTemperatureSymbol,
  isError,
  resolveObjectPath,
  createObjectPath,
  convertNumberToLetters,
  convertLettersToNumber,
  generateUUID
};
