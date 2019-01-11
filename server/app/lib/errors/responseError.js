const errorFilter = require("./errorFilter.js")

module.exports = (message, errors = null, statusCode = 200, isAuthenticated = true)=>{

    message = errorFilter(message)
    if (errors === null || !Array.isArray(errors)) errors = errorFilter(errors, false)

    return ({
        message: message,
        errors: errors,
        statusCode: statusCode,
        isAuthenticated: isAuthenticated,
        isError: true,
        blame: "self"
    })

}