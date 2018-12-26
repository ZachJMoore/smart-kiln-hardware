const FileStore = require('fs-store').FileStore;
const fs = require("fs")
ROOT_APP_PATH = fs.realpathSync('.');

// Create a store
var fsStore = new FileStore({
    filename:  ROOT_APP_PATH + '/app/config/config.json',
    default_object: {
        "temperatureOffset": 0
    }
});

module.exports = fsStore