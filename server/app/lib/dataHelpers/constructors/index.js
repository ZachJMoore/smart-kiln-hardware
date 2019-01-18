const fs = require("fs")
const path = require("path")

const constructors = {}

fs
.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf(".") !== 0) && (file !== "index.js")
})
.forEach(file => {
    constructors[file.replace(".js", "")] = require(path.join(__dirname, file))
})

module.exports = constructors