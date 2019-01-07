class Base {
    constructor(props) {

        this.typeCheck = {
            number: (number, construct) => {
                if (construct) return 1
                else return (typeof number === typeof 1)
            },
            object: (object, construct) => {
                if (construct) return {}
                return (typeof object === typeof {})
            },
            array: (array, construct) => {
                if (construct) return []
                return Array.isArray(array)
            },
            fn: (fn, construct) => {
                if (construct) return (() => { })
                return (typeof fn === typeof (() => { }))
            },
            boolean: (trueFalse, construct) => {
                if (construct) return true
                return (typeof trueFalse === typeof true)
            },
            string: (string, construct) => {
                if (construct) return ""
                return (typeof string === typeof "")
            }
        }

        if (props) {
            this.type = props.type
            this.properties = props.properties
            this.include = {}
            this.validatedProperties = {}
        } else {
            this.type = ""
            this.properties = {}
            this.include = {}
            this.validatedProperties = {}
        }

        this.validate = (type = this.type, properties = this.properties, save = false) => {

            return new Promise((resolve, reject) => {

                if (type === "" || typeof type !== typeof "") {
                    reject("invalid include type")
                    return
                }

                let validatedProperties = {}

                this.include[type].some((prop) => {

                    const key = Object.keys(prop)[0]
                    const typeCheck = Object.values(prop)[0]
                    const allowEmpty = prop.allowEmpty || false
                    const allowNull = prop.allowNull

                    if (properties[key] === undefined) {
                        if (!allowEmpty) {
                            reject(`property '${key}' was not provided`)
                            return true
                        }
                    } else if (properties[key] === null){
                        if (!allowNull){
                            reject(`property '${key}' cannot be null`)
                            return true
                        }
                    } else if (!typeCheck(properties[key])) {
                        reject(`property '${key}' is an invalid type`)
                        return true
                    }

                    if (prop.childrenCheck) {

                        validatedProperties[key] = typeCheck(null, true)
                        const arrayChildTypeCheck = prop.arrayChildTypeCheck

                        if (this.typeCheck.array(validatedProperties[key])) {

                            let isUniqueCheck = {}

                            properties[key].some((value, index) => {

                                if (!arrayChildTypeCheck(value)) {
                                    reject(`property '${key}[${index}]' is an invalid type`)
                                    return true
                                }

                                prop.childrenCheck.some((subProp, subIndex) => {
                                    const subKey = Object.keys(subProp)[0]
                                    const subTypeCheck = Object.values(subProp)[0]
                                    const subAllowEmpty = subProp.allowEmpty
                                    const subAllowNull = subProp.allowNull
                                    const isUnique = subProp.isUnique

                                    if (isUnique){
                                        if (!this.typeCheck.array(isUniqueCheck[subKey])){
                                            isUniqueCheck[subKey] = []
                                        }

                                        isUniqueCheck[subKey].some((uniqueValue)=>{
                                            if (value[subKey] === uniqueValue){
                                                reject(`property '${key}[${index}]'.'${subKey}' must be unique`)
                                                return true
                                            }
                                        })

                                        isUniqueCheck[subKey].push(value[subKey])

                                    }

                                    if (value[subKey] === undefined) {
                                        if (!subAllowEmpty) {
                                            reject(`property '${key}[${index}]'.'${subKey}' was not provided`)
                                            return true
                                        }
                                    } else if (value[subKey] === null){
                                        if (!subAllowNull){
                                            reject(`property '${key}[${index}]'.'${subKey}' cannot be null`)
                                            return true
                                        }
                                    } else if (!subTypeCheck(value[subKey])) {
                                        reject(`property '${key}[${index}]'.'${subKey}' is an invalid type`)
                                        return true
                                    }

                                })

                                validatedProperties[key][index] = value
                            })

                        } else {

                            prop.childrenCheck.some((subProp) => {
                                const subKey = Object.keys(subProp)[0]
                                const subTypeCheck = Object.values(prop)[0]
                                const subAllowEmpty = subProp.allowEmpty
                                const subAllowNull = subProp.allowEmpty

                                if (properties[key][subKey] === undefined) {
                                    if (!subAllowEmpty) {
                                        reject(`property '${key}'.'${subKey}' was not provided`)
                                        return true
                                    }
                                } else if (properties[key][subKey] === null){
                                    if (!subAllowNull){
                                        reject(`property '${key}'.'${subKey}' cannot be null`)
                                        return true
                                    }
                                } else if (!subTypeCheck(properties[key][subKey])) {
                                    reject(`property '${key}'.'${subKey}' is an invalid type`)
                                    return true
                                }

                            })

                            validatedProperties[key][subKey] = properties[key][subKey]
                        }

                    }

                    validatedProperties[key] = properties[key]

                })

                resolve(validatedProperties)
                if (save) this.validatedProperties = validatedProperties

            })

        }


        this.get = () => {

            return new Promise((resolve, reject) => {
                this.validate(this.type, this.properties, true)
                    .then((properties) => {
                        resolve({
                            type: this.type,
                            properties: properties
                        })
                    })
                    .catch(reject)
            })

        }

    }

}

module.exports = Base