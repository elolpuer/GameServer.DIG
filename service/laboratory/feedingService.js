const db = require("../../db/db.js")

//feeding function
async function feeding(
    cardID
){
    //get initial card abilities
    let alwaysAbilities = await getAlwaysNumAbilities(cardID)
    //get real card abilities
    let numAbilities = await getNumAbilities(cardID)
    //checks if abilities not equal
    for (let i = 0; i < alwaysAbilities.length; i++) {
        //if equal continue
        if (alwaysAbilities[i].value == numAbilities[i].value) {
            continue
        //else we add to increase this ability
        } else if (alwaysAbilities[i].value > numAbilities[i].value) {
            db
                .query(feedingText, [i+1, cardID])
                .catch(e => console.error(e))
        }
    }
}

//get initial card abilities
async function getAlwaysNumAbilities(
    cardID
) {
    return db.query(getAlwaysNumAbilitiesText, [cardID]).then(res => {return res.rows})
}

//get real card abilities
async function getNumAbilities(
    cardID
) {
    return db.query(getNumAbilitiesText, [cardID]).then(res => {return res.rows})
}

const getAlwaysNumAbilitiesText = 'SELECT * FROM cardAlwaysNumAbilities WHERE cardid=$1 ORDER BY id ASC'
const getNumAbilitiesText = 'SELECT * FROM cardNumAbilities WHERE cardid=$1 ORDER BY id ASC'

const feedingText = "UPDATE cardNumAbilities SET value=(value + 1) WHERE id=$1 AND cardid=$2"

module.exports = {
    feeding,
    getAlwaysNumAbilities,
    getNumAbilities
}