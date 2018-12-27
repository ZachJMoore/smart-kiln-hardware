const dbMethods = require("../../lib/database/methods/index.js")
const fsStore = require("./fsStore.js")
const generatePassword = require("../../lib/generatePassword.js")
const responseHandler = require("../../lib/fetch/responseHandler.js")


class FSSync {


    constructor(fsStore){

        this.login = () => {

            return new Promise((resolve, reject)=>{

                const password = fsStore.get("password", "")
                const uuid = fsStore.get("uuid", "")

                if (password === "" || uuid === ""){
                    this.signUp()
                    .then((data)=>{
                        if (data.isAuthenticated === false || data.isError){
                            reject(data)
                            return
                        }

                        if (data){
                            fsStore.set("kiln", data)
                            resolve(data)
                        }
                    })
                    .catch((error)=>{
                        reject(error)
                    })
                } else {
                    dbMethods.kiln.login(password, uuid)
                    .then(responseHandler)
                    .then((data)=>{
                        if (data.isAuthenticated === false || data.isError){
                            reject(data)
                            return
                        }

                        if (data){
                            fsStore.set("kiln", data)
                            resolve(data)
                        }
                    })
                    .catch((error)=>{
                        reject(error)
                    })
                }

            })
        }

        this.signUp = () => {

            return new Promise((resolve, reject)=>{

                const password = generatePassword()

                dbMethods.kiln.signUp(password)
                .then(responseHandler)
                .then(data=>{
                    if (data.isAuthenticated === false || data.isError){
                        reject(data)
                        return
                    }

                    fsStore.set("password", password)
                    fsStore.set("uuid", data.uuid)
                    resolve(data)
                })
                .catch((error)=>{
                    reject(error)
                })
            })
        }

        this.updateKilnData = () => {

            return new Promise((resolve, reject)=>{

                dbMethods.kiln.getKilnData()
                .then(responseHandler)
                .then((data)=>{
                    if (data.isAuthenticated === false || data.isError){
                        reject(data)
                        return
                    }

                    if (data){
                        fsStore.set("kiln", data)
                    }
                    resolve(data)
                })
                .catch((error)=>{
                    reject(error)
                })

            })

        }

        this.updateAllSchedules = (userId = 0)=>{

            return new Promise((resolve, reject)=>{

                dbMethods.kiln.getAllSchedules()
                .then(responseHandler)
                .then((data)=>{
                    if (data){
                        fsStore.set("firingSchedules", data)
                    }

                    resolve(data)
                })
                .catch((error)=>{
                    reject(error)
                })

            })

        }

    }

}

let fsSync = new FSSync(fsStore)

module.exports = fsSync