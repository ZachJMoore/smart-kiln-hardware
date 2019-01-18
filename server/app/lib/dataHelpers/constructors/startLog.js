const fsStore = require("../../../fsStore/index.js")

module.exports = (schedule_id)=>{

    let local_id = fsStore.kilnLog.incrementLocalId()
    return {
        firing_schedule_id: schedule_id,
        is_complete: false,
        local_id: local_id,
        created_at: Date.now(),
        updated_at: Date.now()
    }
}