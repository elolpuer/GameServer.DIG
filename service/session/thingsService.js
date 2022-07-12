const db = require("../../db/db.js")

//get all user things
async function getThings(
    address
) {
    const text = 'SELECT * FROM things WHERE owner=$1 ORDER BY id ASC'
    const values = [address]
    let things = 
        await db
            .query(text, values)
            .then(res => {
                return res.rows
            })
            .catch(e => {console.error(e)})
    //add names
    const names = [
        "note",
        "booster",
        "snare",
        "trap",
        "bait"
    ]
    for (let i = 0; i< things.length; i++) {
        things[i].name = names[i];
    }
    return things;
}

async function decreaseThing(
    id,
    address
) {
    const text = 'UPDATE things SET amount=amount-1 WHERE id=$1 AND owner=$2 AND amount>0'
    const values = [id, address]
    await db
            .query(text, values)
            .catch(e => console.error(e))
}

//get all user things
async function getLoserThingsTEST(
) {
    const text = "SELECT * FROM things WHERE owner='0xdE7f42bDA25D749127c4694164aB557821A83b96' ORDER BY id ASC"
    let things = 
        await db
            .query(text, [])
            .then(res => {
                return res.rows
            })
            .catch(e => {console.error(e)})
    //add names
    const names = [
        "note",
        "booster",
        "snare",
        "trap",
        "bait"
    ]
    for (let i = 0; i< things.length; i++) {
        things[i].name = names[i];
    }
    return things;
}

module.exports = {
    getThings,
    decreaseThing,
    getLoserThingsTEST
}