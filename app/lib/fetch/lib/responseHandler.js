module.exports = (res)=>{
    if (!res.ok || res.status !== 200){
        return res.json()
        .then(data=>{
            return Promise.reject(data)
        })
    } else {
        return res.json()
        .then(data=>{
            return Promise.resolve(data)
        })
    }
}