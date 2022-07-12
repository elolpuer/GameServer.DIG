const db = require("../../db/db.js")
const { loseInventory } = require('./loseInventory.js')
const { loseAssets } = require('./loseAssets.js')

//without payoff
//we pick loser assets and invetory
async function writeWinnerWOPayoff(
    winner,
    loser,
    winnerCardID,
    loserCardID
) {
    //write data
    db
        .query(writeWinnerSelectText, [winner])
        .then(res => {
            if (res.rows[0].win_pvp_amount == null) {
                db
                    .query(writeInsertWinnerText, [winner])
                    .catch(e => console.error(e))
            } else {
                db
                    .query(writeWinnerUpdateText, [winner])
                    .catch(e => console.error(e))
            }
        })
    db
        .query(getCardPVP, [winnerCardID])
        .then(res => {
            if (res.rowCount == 0) {
                db
                    .query(insertCard, [winnerCardID, 1, 0])
                    .catch(e => console.error(e))
            } else {
                db
                    .query(updateCardWinner, [winnerCardID])
                    .catch(e => console.error(e))
            }
        })
    //pvp data - who win and lose for statistics
    db
        .query(writePVP, [winner, loser, winnerCardID, loserCardID])
        .catch(e => console.error(e))
    //lose assets
    await loseAssets(winner, loser)
    //lose inventory
    await loseInventory(winner, loser)
}

//with payoff
//we not pick loser assets and invetory
async function writeWinnerWPayoff(
    winner,
    loser,
    winnerCardID,
    loserCardID
) {
    db
        .query(writeWinnerSelectText, [winner])
        .then(res => {
            if (res.rows[0].win_pvp_amount == null) {
                db
                    .query(writeInsertWinnerText, [winner])
                    .catch(e => console.error(e))
            } else {
                db
                    .query(writeWinnerUpdateText, [winner])
                    .catch(e => console.error(e))
            }
        })
    db
        .query(getCardPVP, [winnerCardID])
        .then(res => {
            if (res.rowCount == 0) {
                db
                    .query(insertCard, [winnerCardID, 1, 0])
                    .catch(e => console.error(e))
            } else {
                db
                    .query(updateCardWinner, [winnerCardID])
                    .catch(e => console.error(e))
            }
        })
    db
        .query(writePVP, [winner, loser, winnerCardID, loserCardID])
        .catch(e => console.error(e))
}

//write loser data
async function writeLoser(
    loser,
    cardID
) {
    //amount of loser lose +1
    db
        .query(writeLoserSelectText, [loser])
        .then(res => {
            if (res.rows[0].lose_pvp_amount == null) {
                db
                    .query(writeInsertLoserText, [loser])
                    .catch(e => console.error(e))
            } else {
                db
                    .query(writeLoserUpdateText, [loser])
                    .catch(e => console.error(e))
            }
        })
    //amount of card lose +1
    db
        .query(getCardPVP, [cardID])
        .then(res => {
            if (res.rowCount == 0) {
                db
                    .query(insertCard, [cardID, 0, 1])
                    .catch(e => console.error(e))
            } else {
                db
                    .query(updateCardLose, [cardID])
                    .catch(e => console.error(e))
            }
        })
}

async function getWinAmount(
    address
) {
    return await db.query(writeWinnerSelectText, [address]).then(res => {return res.rows[0].win_pvp_amount})
}

async function getLoseAmount(
    address
) {
    return await db.query(writeLoserSelectText, [address]).then(res => {return res.rows[0].lose_pvp_amount})
}

async function getLoserTESTAssetsAmount() {
    return await db.query("SELECT * FROM userassets WHERE useraddress='0xdE7f42bDA25D749127c4694164aB557821A83b96'")
        .then(res => {return res.rowCount})
}

const writeWinnerSelectText = 'SELECT win_pvp_amount FROM users WHERE address=$1'
const writeInsertWinnerText = 'UPDATE users SET win_pvp_amount=1 WHERE address=$1'
const writeWinnerUpdateText = 'UPDATE users SET win_pvp_amount=win_pvp_amount+1 WHERE address=$1'

const writeLoserSelectText = 'SELECT lose_pvp_amount FROM users WHERE address=$1'
const writeInsertLoserText = 'UPDATE users SET lose_pvp_amount=1 WHERE address=$1'
const writeLoserUpdateText = 'UPDATE users SET lose_pvp_amount=lose_pvp_amount+1 WHERE address=$1'

const getCardPVP = 'SELECT * FROM cardspvp WHERE card_id=$1'
const insertCard = 'INSERT INTO cardspvp (card_id, win_amount, lose_amount) VALUES($1, $2, $3)'
const updateCardWinner = 'UPDATE cardspvp SET win_amount=win_amount+1 WHERE card_id=$1'
const updateCardLose = 'UPDATE cardspvp SET lose_amount=lose_amount+1 WHERE card_id=$1'

const writePVP = 'INSERT INTO pvp (winner, loser, winner_card_id, loser_card_id) VALUES($1, $2, $3, $4)'

module.exports = {
    writeWinnerWOPayoff,
    writeWinnerWPayoff,
    writeLoser,
    getLoseAmount,
    getWinAmount,
    getLoserTESTAssetsAmount
}