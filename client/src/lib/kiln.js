

class Kiln{

    constructor(url = "http://localhost:2222/api"){

        this.url = url
        this.getPackage = ()=>{
            return fetch(`${this.url}/kiln/get-package`)
        }
        this.startFiring = (schedule)=>{
            return fetch(`${this.url}/kiln/start-firing`, {
                headers: {"Content-Type": "application/json"},
                method: "post",
                body: JSON.stringify({schedule: schedule})
            })
        }
        this.stopFiring = ()=>{
            return fetch(`${this.url}/kiln/stop-firing`)
        }
        this.getSchedules = ()=>{
            return fetch(`${this.url}/get-schedules`)
        }
    }

}

export default Kiln