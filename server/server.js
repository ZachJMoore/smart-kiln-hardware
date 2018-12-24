require("dotenv").config()
const fs = require("fs");
const express = require("express");
const app = express();
const kilnController = require("./app/routes/kilnController")
const PORT = process.env.PORT || 2222;
const DB_HOST = process.env.DB_HOST
const io = require("socket.io-client")


// For Express
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-access-token, Content-Type");
    next();
})

app.use("/api/kiln", kilnController);

app.use("/api/get-schedules", (req, res)=>{
    fs.readFile("app/config/firingSchedules.json", "utf8", (error, data) => {
        if (error){
            console.log("error: ", error)
            res.status(500).send()
        } else {
            data = JSON.parse(data)
            res.send(data)
        }
    })
})

app.use(express.static('app/public/'))
app.get("*", (request, response) => (response.sendFile(__dirname + 'app/public/index.html')))

// For Socket.io

    const socket = io(DB_HOST)

// Start server

let isDebug = process.env.DEBUG === "true"
let isFakeData = process.env.FAKE_DATA === "true"

const server = app.listen(PORT, ()=>{
    console.log(new Date() + ": server running on port: " + PORT)
    console.log(`Server is started in ${process.env.NODE_ENV} mode with debug ${isDebug ? "on" : "off"} ${isFakeData ? "and fake data is being supplied" : "and real data is being supplied"}`)
});