const tough = require("tough-cookie")
const fsStore = require("../syncing/lib/fsStore.js")
const sessionCookie = fsStore.get("cookie", null)

let cookieJar = new tough.CookieJar()

if (sessionCookie !== null) {
    const cookie = tough.Cookie.parse(sessionCookie)
    cookieJar.setCookie(cookie)
}

module.exports = cookieJar