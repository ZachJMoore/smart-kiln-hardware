require("dotenv").config();
const jetpack = require("fs-jetpack");
const fs = require("fs");
const ROOT_PATH = fs.realpathSync(".");

jetpack.remove(ROOT_PATH + "/build");

let BUILD_USE_ENV = process.env.BUILD_USE_ENV;
let env = null;

if (BUILD_USE_ENV && typeof BUILD_USE_ENV === typeof "") env = BUILD_USE_ENV;
else env = ".env.default";

jetpack.copy(ROOT_PATH + "/app", ROOT_PATH + "/build/app");
jetpack.remove(ROOT_PATH + "/build/app/storage");
jetpack.copy(ROOT_PATH + `/${env}`, ROOT_PATH + "/build/.env");
jetpack.copy(ROOT_PATH + "/package.json", ROOT_PATH + "/build/package.json");
jetpack.copy(ROOT_PATH + "/app.js", ROOT_PATH + "/build/app.js");
jetpack.copy(ROOT_PATH + "/Dockerfile", ROOT_PATH + "/build/Dockerfile");
jetpack.copy(ROOT_PATH + "/.dockerignore", ROOT_PATH + "/build/.dockerignore");
jetpack.copy(ROOT_PATH + "/README.md", ROOT_PATH + "/build/README.md");
jetpack.copy(
  ROOT_PATH + "/firingSchedule.json",
  ROOT_PATH + "/build/firingSchedule.json"
);
jetpack.copy(ROOT_PATH + "/nodemon.json", ROOT_PATH + "/build/nodemon.json");
jetpack.copy(ROOT_PATH + "/setup.js", ROOT_PATH + "/build/setup.js");

console.log("build complete");
