module.exports = (response)=>{
    if (!response.ok){
        return response.json().then(data=>{
            return Promise.reject(data)
        })
    }
    return response.json()
}