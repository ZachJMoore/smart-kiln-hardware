module.exports = (error, isStringResponse = true)=>{

    if (!error){
        if (isStringResponse) return "Unable to find a valid error message"
        else return ["Unable to find a valid array of errors"]
    }

    if (Array.isArray(error) || !isStringResponse){

        if (Array.isArray(error)) return error

        if (error.errors && error.errors.length > 0) return error.errors.map(error => error.message)

        if (error.message && Array.isArray(error.message)) return error.message

        if (error.message && Array.isArray(error.message)) return error.message

        if (typeof error === typeof "") return [error]

        if (error.message && typeof error.message === typeof "") return [error.message]

        return ["Unable to find a valid array of errors"]

    }

    if (isStringResponse){

        if (typeof error === typeof "") return error

        if (error.errors && error.errors.length > 0 && typeof error.errors[0].message === typeof "") return error.errors[0].message

        if (error.errors && error.errors.length > 0) return error.errors[0]

        if (error.message && typeof error.message === typeof "") return error.message

        return ("Unable to find a valid error message")

    }

}