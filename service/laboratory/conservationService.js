const db = require("../../db/db.js")

const secondsInDay = 86400

//starting conservation
async function startConservation(
    cardID, abilityID
){
    const today = new Date();
    const oneMonth = new Date();
    // Add 1 Month
    oneMonth.setDate(today.getDate() + 30);
    //get if we already have this card conservation
    let rowCount = await getConservationRowCount(cardID)
    if (rowCount == 0) {
        await db
            .query(startConservationText, [abilityID, cardID, oneMonth])
            .catch(e => console.error(e.stack))
    }
}

//ending conservation
async function endConservation(
    cardID
) {
    //get conservation values
    let conservation = await getConservation(cardID);
    let dateNow = new Date()
    let dateWhenEnded = new Date(conservation.whenended)
    //checks if conservation ended
    if (dateNow > dateWhenEnded) {
        //ending
        await db
            .query(endConservationText, [conservation.id, cardID])
            .then(()=>{
                db
                    .query(deleteConservationText, [cardID])
                    .catch(e => console.error(e))
            })
            .catch(e => console.error(e.stack))
    }
}

//get conservation values
async function getConservation(
    cardID
) {
    return db.query(getConservationText, [cardID]).then(res => {return res.rows[0]})
}

//get if we have conservation
async function getConservationRowCount(
    cardID
) {
    return db.query(getConservationText, [cardID]).then(res => {return res.rowCount})
}

//FOR TESTING
//mock time of card
async function mockTime(
    cardID
) {
    const today = new Date();
    const oneMonth = new Date();
    // Add 1 Day
    oneMonth.setDate(today.getDate() - 30);
    await db
        .query(mockTimeText, [oneMonth, cardID])
        .catch(e => console.error(e.stack))
}

const endConservationText = "UPDATE cardAlwaysNumAbilities SET value=(value + 1) WHERE id=$1 AND cardid=$2"
const deleteConservationText = "DELETE FROM conservation WHERE cardid=$1"
const startConservationText = 'INSERT INTO "conservation" ("id","cardid","whenended") VALUES($1, $2, $3)'
const mockTimeText = 'UPDATE conservation SET whenended=$1 WHERE cardid=$2'
const getConservationText = 'SELECT * FROM conservation WHERE cardid=$1'

module.exports = {
    startConservation,
    endConservation,
    getConservation,
    mockTime
}