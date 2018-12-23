const Gpio = require('onoff').Gpio;
const relay = new Gpio(27, 'out');

relay.writeSync(1)
console.log(relay.readSync())

setTimeout(()=>{
    relay.writeSync(0)
    console.log(relay.readSync())
}, 10000)