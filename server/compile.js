require("dotenv").config()
const jetpack = require("fs-jetpack")
const fs = require("fs")
const ROOT_PATH = fs.realpathSync('.')

jetpack.remove(ROOT_PATH+"/build")

let BUILD_USE_ENV = process.env.BUILD_USE_ENV
let env = null

if (BUILD_USE_ENV && typeof BUILD_USE_ENV === typeof "") env = BUILD_USE_ENV
else env = ".env.default"

jetpack.copy(ROOT_PATH+"/app", ROOT_PATH+"/build/app")
jetpack.remove(ROOT_PATH+"/build/app/config")
jetpack.remove(ROOT_PATH+"/build/app/public")
jetpack.copy(ROOT_PATH + `/${env}`, ROOT_PATH+"/build/.env")
jetpack.copy(ROOT_PATH+"/package.json", ROOT_PATH+"/build/package.json")
jetpack.copy(ROOT_PATH+"/server.js", ROOT_PATH+"/build/server.js")
jetpack.copy(ROOT_PATH+"/Dockerfile", ROOT_PATH+"/build/Dockerfile")
jetpack.copy(ROOT_PATH+"/.dockerignore", ROOT_PATH+"/build/.dockerignore")

console.log("server build complete")