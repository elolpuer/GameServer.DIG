const db = require("../../db/db.js")
const Web3 = require("web3")
const DIG = require('../../../build/contracts/DigitalGolems.json')
const config = require("config")
require('dotenv').config()
const mnemonic = process.env.MNEMONIC
const digAddress = config.get("DIG")

const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://data-seed-prebsc-1-s1.binance.org:8545"))
// const web3 = new HDWalletProvider(mnemonic, webSocketProvider);
// const web3 = new Web3("http://127.0.0.1:7545")

async function decreaseNumAbility(
    cardID
) {
    db
        .query(text, [cardID])
        .catch(e => console.error(e))
}

async function getUserCards(
    cards
) {
    let userCards = []
    for (let i = 0; i < cards.length; i++) {
        let numAbilities = await db.query(getAllCardsNumAbility, [parseInt(cards[i])]).then(res => {return res.rows})
        let alwaysAbilities = await db.query(cardAlwaysNumAbilities, [parseInt(cards[i])]).then(res => {return res.rows})
        let boolAbilities = await db.query(cardBoolAbilities, [parseInt(cards[i])]).then(res => {return res.rows})
        let maxAbility = await getMaxAbility(parseInt(cards[i]))
        let card = {
            id: cards[i],
            numAbilities,
            alwaysAbilities,
            boolAbilities,
            maxAbility
        }
        userCards[i] = card
    }
    return userCards;
}

async function getMaxAbility(
    cardID
) {
    return await db.query(getMaxAbilityText, [cardID]).then(res => {return res.rows[0].value})
}

const text = "UPDATE cardNumAbilities SET value=value-1 WHERE cardid=$1 AND value>0"
const getAllCardsNumAbility = "SELECT * FROM cardNumAbilities WHERE cardid=$1 ORDER BY id ASC"
const cardAlwaysNumAbilities = "SELECT * FROM cardAlwaysNumAbilities WHERE cardid=$1 ORDER BY id ASC"
const cardBoolAbilities = "SELECT * FROM cardBoolAbilities WHERE cardid=$1 ORDER BY id ASC"
const getMaxAbilityText = 'SELECT value FROM cardAlwaysNumAbilities WHERE cardid=$1 ORDER BY value DESC LIMIT 1'

module.exports = {
    getUserCards,
    decreaseNumAbility,
    getMaxAbility
}
