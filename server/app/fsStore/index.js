const fs = require("fs")
const path = require("path")

const fsStore = {}

fs
.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf(".") !== 0) && (file !== "index.js") && (file !== "Base.js")
})
.forEach(file => {
    fsStore[file.replace(".js", "")] = require(path.join(__dirname, file))
})

module.exports = fsStore