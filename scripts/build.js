const fs = require("fs");
const ROOT_PATH = fs.realpathSync(".");
require("dotenv").config({
  path: ROOT_PATH + "/.env"
});
const jetpack = require("fs-jetpack");

jetpack.remove(ROOT_PATH + "/build");

// Select which environment variables to use for build step
let BUILD_USE_ENV = process.env.BUILD_USE_ENV;
let env = null;
if (BUILD_USE_ENV && typeof BUILD_USE_ENV === typeof "") env = BUILD_USE_ENV;
else env = ".env.default";

// Select which package.json to use for build step - Really only useful for excluding things for testing locally
let BUILD_USE_PACKAGE_JSON = process.env.BUILD_USE_PACKAGE_JSON;
let packageJSON = null;
if (BUILD_USE_PACKAGE_JSON && typeof BUILD_USE_PACKAGE_JSON === typeof "")
  packageJSON = BUILD_USE_PACKAGE_JSON;
else packageJSON = "package.json";

jetpack.copy(ROOT_PATH + "/app", ROOT_PATH + "/build/app");
jetpack.remove(ROOT_PATH + "/build/app/storage");
jetpack.copy(ROOT_PATH + `/${env}`, ROOT_PATH + "/build/.env");
jetpack.copy(ROOT_PATH + `/${packageJSON}`, ROOT_PATH + "/build/package.json");
jetpack.copy(ROOT_PATH + "/app.js", ROOT_PATH + "/build/app.js");
jetpack.copy(ROOT_PATH + "/Dockerfile", ROOT_PATH + "/build/Dockerfile");
jetpack.copy(ROOT_PATH + "/.dockerignore", ROOT_PATH + "/build/.dockerignore");
jetpack.copy(ROOT_PATH + "/README.md", ROOT_PATH + "/build/README.md");
jetpack.copy(ROOT_PATH + "/nodemon.json", ROOT_PATH + "/build/nodemon.json");
jetpack.copy(
  ROOT_PATH + "/scripts/setup.js",
  ROOT_PATH + "/build/scripts/setup.js"
);

console.log(new Date() + ": " + "build complete");
