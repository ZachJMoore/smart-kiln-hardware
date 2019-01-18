module.exports = (local_id, schedule_id)=>{
    return {
        firing_schedule_id: schedule_id,
        is_complete: false,
        local_id: local_id,
        created_at: Date.now(),
        updated_at: Date.now()
    }
}