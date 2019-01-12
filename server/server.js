require("dotenv").config()
const fs = require("fs");
const express = require("express");
const app = express();
const kilnController = require("./app/routes/kilnController")
const env = process.env.NODE_ENV
const PORT = process.env.PORT || 2222;
const fsStore = require("./app/syncing/lib/fsStore.js")


// Syncing to database
const sync = require("./app/syncing/sync.js")


// For Express
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-access-token, Content-Type");
    next();
})

app.use("/api/kiln", kilnController);

app.use("/api/get-schedules", (req, res)=>{
    let schedules = fsStore.getAllSchedules()
    res.json(schedules)
})


const ROOT_APP_PATH = fs.realpathSync('.');

app.use(express.static(ROOT_APP_PATH + '/app/public'))
app.get("*", (request, response) => (response.sendFile(ROOT_APP_PATH + '/app/public/index.html')))


// Start server

let isDebug = process.env.DEBUG === "true"
let isFakeData = process.env.FAKE_DATA === "true"

const server = app.listen(PORT, ()=>{
    console.log(new Date() + ": server running on port: " + PORT)
    console.log(`Server is started in ${process.env.NODE_ENV} mode with debug ${isDebug ? "on" : "off"} ${isFakeData ? "and fake data is being supplied" : "and real data is being supplied"}`)
});