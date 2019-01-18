import io from "socket.io-client"

class KilnIo{
    constructor(){
        this.host = "http://localhost:2222"
        this.socket = io(this.host)

        this.emitGetKilnData = ()=>{
            this.socket.emit("get-kiln-data")
        }
    }
}

const kilnIo = new KilnIo()

export default kilnIo