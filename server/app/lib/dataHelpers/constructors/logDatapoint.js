const fsStore = require("../../../fsStore/index.js")

module.exports = (temperature)=>{

    let local_id = fsStore.kilnLog.getLocalId()
    return {
        local_id: local_id,
        temperature: temperature,
        created_at: Date.now()
    }
}