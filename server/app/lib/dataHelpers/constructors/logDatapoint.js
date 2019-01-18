module.exports = (local_id, temperature)=>{
    return {
        local_id: local_id,
        temperature: temperature,
        created_at: Date.now()
    }
}