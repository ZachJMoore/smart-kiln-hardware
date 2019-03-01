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

module.exports.convertNumberToLetters = (number)=>{
    const l = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j" ]
    const ns = number.toString().split("")
    let lts = ""

    ns.forEach((string=>{
        lts += l[parseInt(string)]
    }))

    return lts
}

module.exports.convertLettersToNumber = (letters)=>{
    const l = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7,
        i: 8,
        j: 9
    }
    let nb = []

    letters.split("").forEach((letter)=>{
        nb.push(l[letter])
    })

    return parseInt(nb.join(""))
}

module.exports.generateUUID = () => {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
