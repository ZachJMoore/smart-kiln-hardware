module.exports = (temperature)=>{
    return {
        temperature: temperature,
        created_at: Date.now()
    }
}