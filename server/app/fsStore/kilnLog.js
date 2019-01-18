const Base = require("./Base.js")

class KilnLog extends Base{
    constructor(props){
        super(props)

        this.directory = this.directory.cwd("kilnLog")

        this.setKilnLog = (kilnLog) => {
            this.directory.write("kiln_log.json", kilnLog, {
                atomic: true
            })
        }

        this.getKilnLog = () => {
            let data = this.directory.read("kiln_log.json", "json")
            if (!data){
                data = null
            }
            return data
        }

        this.getLocalId = ()=>{
            let localIncrement = this.directory.read("local_increment.json", "json")
            if (!localIncrement){
                localIncrement = {id: 0}
            }
            return localIncrement.id
        }

        this.incrementLocalId = ()=>{
            let localIncrement = this.directory.read("local_increment.json", "json")
            if (!localIncrement){
                localIncrement = {id: 0}
            }
            localIncrement.id = localIncrement.id + 1
            this.directory.write("local_increment.json", localIncrement, {
                atomic: true
            })
            return localIncrement.id

        }
    }
}

module.exports = new KilnLog()