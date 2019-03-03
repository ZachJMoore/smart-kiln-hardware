const fs = require("fs")

fs.readFile("/etc/dhcpcd.conf", (error, buffer)=>{
    if (error) console.log(error)
    else {
        array = buffer.toString("utf8").split(/\r\n|\r|\n/g)
        // console.log(array)
        newString = array.filter((line)=>{
            if (line === "" || line[0] === "#") return false
            else return true
        }).map((line)=>{
            if (line.includes("slaac private")) return "#This is an edit of 'slaac private'. We are changing this to a comment"
            else if (line.includes("hostname")) return "#We are commenting out the 'hostname' attribute of this config"
            else return line
        }).join("\n")
        console.log(newString)

        fs.writeFile("/etc/dhcpcd.conf.bak", new Buffer(newString), (error)=>{
            if (error) console.log(error)
        })
    }
})