module.exports.celsiusToFahrenheit = (value)=>{
    return parseFloat(
            ((value * 1.8) + 32).toFixed(2)
        )
}
module.exports.fahrenheitToCelsius = (value)=>{
    return parseFloat(
            ((value - 32) * (5/9)).toFixed(2)
        )
}

module.exports.isError = (e) => {
    return e && e.stack && e.message && typeof e.stack === 'string' 
           && typeof e.message === 'string';
   }

module.exports.resolveObjectPath = (path, obj) => {
    if (Array.isArray(path)) path = path.join(".")
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj)
}

module.exports.createObjectPath = (path, obj) => {
    if (Array.isArray(path)) path = path.join(".")
    return path.split('.').reduce(function(prev, curr) {
        return prev[curr] = {}
    }, obj)
}
