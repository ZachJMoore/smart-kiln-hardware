const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const kiln = require('../lib/kiln');

kiln.init()

const isLocal = (req, res, next)=>{

    var ip = req.connection.remoteAddress;
    if (ip === "::1" || ip === "::ffff:172.17.0.1"){
        next()
        return
    }
};

router.get("/get-temperature", isLocal, (req, res) => {
    kiln.getTemperature()
    .then(temperature => {
        res.send({
            temperature: temperature
        });
    })
    .catch(error => {
        res.status(503).send(error);
    });
});

router.get("/get-package", isLocal, (req, res)=>{
    res.send(kiln.getPackage())
})

router.get("/stop-firing", isLocal, (req, res)=>{
    kiln.stopFiring()
    res.send({message: "Firing stopped"})
})

router.post("/start-firing", isLocal, (req, res)=>{
    let schedule = req.body.schedule
    if (!schedule) {
        res.send({message:"No schedule provided"})
    } else {
        console.log(schedule.name)
        kiln.startFiring(schedule)
        res.send({message:`schedule ${schedule.name} started successfully`})
    }
})

module.exports = router;