const jetpack = require("fs-jetpack")
const fs = require("fs")
const ROOT_PATH = fs.realpathSync('.')

jetpack.remove(ROOT_PATH+"/build")

jetpack.copy(ROOT_PATH+"/server/build", ROOT_PATH+"/build/soft")
jetpack.copy(ROOT_PATH+"/client/build", ROOT_PATH+"/build/soft/app/public")

console.log("project build complete")