const fs = require("fs")
const jetpack = require("fs-jetpack")
ROOT_APP_PATH = fs.realpathSync('.')

class Base {


    constructor(){

        this.directory = jetpack.cwd(ROOT_APP_PATH + "/app/config/")

    }

}

module.exports = Base