const db = require("../../../db/db.js")

//get chance for combine
async function getChance(
    owner
) {
    //get chance from db
    let chance = 
        await db
                .query(getChanceText, [owner])
                .then(async(res) => {
                    //if we hadnt user chance in db
                    //adding it and return 25%
                    if (res.rowCount == 0) {
                        await addChance25(owner)
                        return 25;
                    } else { //else send chance
                        return res.rows[0].chance
                    }
                })
    return chance;
}

//adding chance 25%
async function addChance25(
    owner
) {
    db
        .query(addChanceText, [owner, 25])
        .catch(e => console.error(e))
}

async function updateChance25(
    owner
) {
    db
        .query(updateChanceText, [owner, 25])
        .catch(e => console.error(e))
}

//adding chance 50%
async function addChance50(
    owner
) {
    db
        .query(updateChanceText, [owner, 50])
        .catch(e => console.error(e))
}

//adding chance 75%
async function addChance75(
    owner
) {
    db
        .query(updateChanceText, [owner, 75])
        .catch(e => console.error(e))
}

async function addChance100(
    owner
) {
    db
        .query(updateChanceText, [owner, 100])
        .catch(e => console.error(e))
}

const getChanceText = "SELECT chance FROM combiningchance WHERE useraddress=$1"
const addChanceText = 'INSERT INTO combiningchance (useraddress, chance) VALUES($1, $2)'
const updateChanceText = 'UPDATE combiningchance SET chance=$2 WHERE useraddress=$1'

module.exports = {
    addChance25,
    addChance50,
    addChance75,
    getChance,
    updateChance25,
    addChance100
}