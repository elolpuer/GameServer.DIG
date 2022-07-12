const db = require("../db/db.js")

//change username
async function changeUsername(
    username,
    address
) {
    console.log(username, address)
    const text = 'UPDATE users SET username=$1 WHERE address=$2'
    const values = [username, address]
    await db
        .query(text, values)
        .catch(e => console.log(e.stack))
}

module.exports = {
    changeUsername
}