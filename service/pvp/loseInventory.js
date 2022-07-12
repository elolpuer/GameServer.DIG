const db = require("../../db/db.js")

//lose inventory after PVP
async function loseInventory(
    winner, //address
    loser   //address
) {
    //create rand number
    const rand = Math.floor(Math.random() * 10 **10) % 3
    if (rand == 0) {
        await loseThings(winner, loser)
    }
    if (rand == 1) {
        await loseResources(winner, loser)
    }
    if (rand == 2) {
        await loseAugmentations(winner, loser)
    }
}

async function loseThings(
    winner,
    loser
){
    //get loser things
    db
        .query(getThingsText, [loser])
        .then(res => {
            //get loser things where amount not 0
            let thingsWhereAmountNotZero = []
            for (let i = 0; i < res.rowCount; i++) {
                if (res.rows[i].amount != 0) {
                    thingsWhereAmountNotZero.push(res.rows[i])
                }
            }
            //random thing delete from loser and add to winner
            let randID = Math.floor(Math.random() * 10 **10) % thingsWhereAmountNotZero.length
            db
                .query(decreaseThing, [loser, thingsWhereAmountNotZero[randID].id])
                .catch(e => console.error(e))
            db
                .query(increaseThing, [winner, thingsWhereAmountNotZero[randID].id])
                .catch(e => console.error(e))
        })
}

async function loseResources(
    winner,
    loser
){
    db
        .query(getResourcesText, [loser])
        .then(res => {
            let resourcesWhereAmountNotZero = []
            for (let i = 0; i < res.rowCount; i++) {
                if (res.rows[i].amount != 0) {
                    resourcesWhereAmountNotZero.push(res.rows[i])
                }
            }
            let randID = Math.floor(Math.random() * 10 **10) % resourcesWhereAmountNotZero.length
            db
                .query(decreaseResource, [loser, resourcesWhereAmountNotZero[randID].id])
                .catch(e => console.error(e))
            db
                .query(increaseResource, [winner, resourcesWhereAmountNotZero[randID].id])
                .catch(e => console.error(e))
        })
}

async function loseAugmentations(
    winner,
    loser
){
    db
        .query(getAugmentationsText, [loser])
        .then(res => {
            let augmentWhereAmountNotZero = []
            for (let i = 0; i < res.rowCount; i++) {
                if (res.rows[i].amount != 0) {
                    augmentWhereAmountNotZero.push(res.rows[i])
                }
            }
            let randID = Math.floor(Math.random() * 10 **10) % augmentWhereAmountNotZero.length
            db
                .query(decreaseAugmentation, [loser, augmentWhereAmountNotZero[randID].id])
                .catch(e => console.error(e))
            db
                .query(increaseAugmentation, [winner, augmentWhereAmountNotZero[randID].id])
                .catch(e => console.error(e))
        })
}

const getAugmentationsText = 'SELECT * FROM augmentations WHERE owner=$1'
const getThingsText = 'SELECT * FROM things WHERE owner=$1'
const getResourcesText = 'SELECT * FROM resources WHERE owner=$1'
const decreaseResource = 'UPDATE resources SET amount=amount-1 WHERE owner=$1 AND id=$2'
const decreaseThing = 'UPDATE things SET amount=amount-1 WHERE owner=$1 AND id=$2'
const decreaseAugmentation = 'UPDATE augmentations SET amount=amount-1 WHERE owner=$1 AND id=$2'
const increaseResource = 'UPDATE resources SET amount=amount+1 WHERE owner=$1 AND id=$2'
const increaseThing = 'UPDATE things SET amount=amount+1 WHERE owner=$1 AND id=$2'
const increaseAugmentation = 'UPDATE augmentations SET amount=amount+1 WHERE owner=$1 AND id=$2'

module.exports = {
    loseInventory
}