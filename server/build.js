const jetpack = require("fs-jetpack")
const fs = require("fs")
const ROOT_PATH = fs.realpathSync('.')

jetpack.remove(ROOT_PATH+"/build")

jetpack.copy(ROOT_PATH+"/node_modules", ROOT_PATH+"/build/node_modules")
jetpack.copy(ROOT_PATH+"/app", ROOT_PATH+"/build/app")
jetpack.remove(ROOT_PATH+"/build/app/config")
jetpack.remove(ROOT_PATH+"/build/app/public")
jetpack.copy(ROOT_PATH+"/.env.example", ROOT_PATH+"/build/.env")
jetpack.copy(ROOT_PATH+"/package.json", ROOT_PATH+"/build/package.json")
jetpack.copy(ROOT_PATH+"/server.js", ROOT_PATH+"/build/server.js")

console.log("server build complete")