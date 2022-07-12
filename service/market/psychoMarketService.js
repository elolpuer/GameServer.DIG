const db = require("../../db/db.js")

async function addPsychoMarketItem(
    owner,
    psychoID,
    price
) {
    db
        .query(getIsUserPsychoText, [owner, psychoID])
        .then(res => {
            if (res.rowCount != 0) {
                db
                    .query("SELECT * FROM marketPsychoItem WHERE psychoID=$1", [psychoID])
                    .then(res => {
                        if (res.rowCount == 0) {
                            db
                                .query(createMarketItemText, [psychoID, owner, price])
                                .catch(e => console.error(e))
                        }
                    })
            }
        })
}

async function deleteMarketItem(
    owner,
    marketID
) {
    await db
        .query(deleteOwnerMarketItemText, [marketID, owner])
        .catch(e => console.error(e))
}

async function buyPsychoMarketItem(
    marketID,
    buyer
) {
    db
        .query(getMarketItemText, [marketID])
        .then(res => {
            db
                .query(deleteMarketItemText, [marketID])
                .catch(e => console.error(e))
            db
                .query(changeUserPsychoText, [buyer, res.rows[0].psychoid])
                .catch(e => console.error(e))
            
           })
}

async function getAllPsychoMarketItems() {
    return await db
            .query(getAllPsychoMarketItemsText, [])
            .then(res => {
                return res.rows
            })
}

async function getOwnerPsychoMarketItems(
    owner
) {
    return await db
            .query(getMarketItemOwnerText, [owner])
            .then(res => {
                return res.rows
            })
}


const getIsUserPsychoText = 'SELECT * FROM psychospheres WHERE owner=$1 AND id=$2 AND looted=false'
const createMarketItemText = "INSERT INTO marketPsychoItem (psychoID, owner, buyer, price, sold) VALUES($1, $2, '0', $3, false)"
const buyMarketItemText = "UPDATE marketPsychoItem SET buyer=$1, sold=true WHERE id=$2"
const deleteMarketItemText="DELETE FROM marketPsychoItem WHERE id=$1"
const deleteOwnerMarketItemText="DELETE FROM marketPsychoItem WHERE id=$1 AND owner=$2"
const changeUserPsychoText = 'UPDATE psychospheres SET owner=$1 WHERE id=$2'
const getAllPsychoMarketItemsText = 'SELECT * FROM marketPsychoItem WHERE sold=false'
const getOwnerPsychoMarketItemsText = 'SELECT * FROM marketPsychoItem WHERE sold=false AND owner=$1'
const getMarketItemText = 'SELECT * FROM marketPsychoItem WHERE id=$1'
const getMarketItemOwnerText = 'SELECT * FROM marketPsychoItem WHERE owner=$1'

module.exports = {
    addPsychoMarketItem,
    getAllPsychoMarketItems,
    buyPsychoMarketItem,
    deleteMarketItem,
    getOwnerPsychoMarketItems
}