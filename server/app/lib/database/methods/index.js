"use strict";

const fs = require("fs")
const path = require("path")
const requestConfig = require("../requestConfig.json")
const DB_HOST = process.env.DB_HOST

const config = {
    databaseHost: DB_HOST,
    requestConfig: requestConfig
}
let db = {}

fs
.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf(".") !== 0) && (file !== "index.js")
})
.forEach(file => {
    const method = require(path.join(__dirname, file))(config)
    db[file.replace(".js", "")] = method
})

module.exports = db