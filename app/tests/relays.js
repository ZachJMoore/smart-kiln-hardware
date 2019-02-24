require("dotenv").config()
const Relays = require("../components/Kiln/lib/Relays")

const relays = new Relays(process.env.RELAY_BOARD_VERSION || "v1")


console.log("Turning all relays: ON")
relays.setRelays(1)

setTimeout(()=>{

    console.log("Turning all relays: OFF")
    relays.setRelays(0)

}, 2*1000)

setTimeout(()=>{

    let on = null

    if (this.relayType === "v1"){
        on = 1
    } else if (this.relayType === "v2"){
        on = 0
    }

    relays.relays.forEach((relay, index)=>{
        if (index === relays.relays.length - 1){
            setTimeout(()=>{
                relays.setRelays(0)
            }, (index*1000)+1000)
        }
        if (index === 0){
            console.log("Relay: " + (index+1) + " Turned: ON")
            relay.writeSync(on)
        } else{
            setTimeout(()=>{

                console.log("Relay: " + (index+1) + " Turned: ON")
                relay.writeSync(on)

            }, index*1000)
        }
    })

}, 4*1000)


