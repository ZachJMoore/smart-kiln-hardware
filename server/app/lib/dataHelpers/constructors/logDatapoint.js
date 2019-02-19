const fsStore = require("../../../fsStore/index.js")
const kiln = require("../../../kiln")

module.exports = (temperature)=>{

    return {
        local_id: fsStore.kilnLog.getLocalId(),
        temperature: kiln.temperature,
        created_at: Date.now()
    }
    
}