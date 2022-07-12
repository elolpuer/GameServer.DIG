const db = require("../../db/db.js")
const { getAssetImage } = require("../assets/assetsService.js")

//create market item
async function addAssetMarketItem(
    owner,
    assetIDInUserTable, //id in userAssets table
    assetID,            //asset id
    price               //price
) {
    db
        .query(getIsUserAssetText, [owner, assetID])
        .then(res => {
            //if it not already added
            if (res.rowCount != 0) {
                db
                    .query("SELECT * FROM marketAssetItem WHERE assetIDInUserTable=$1", [assetIDInUserTable])
                    .then(res => {
                        if (res.rowCount == 0) {
                            db
                            .query(createMarketItemText, [assetID, assetIDInUserTable, owner, price])
                            .catch(e => console.error(e))
                        }
                    })
            }
        })
}

//buying asset
async function buyAssetMarketItem(
    marketID,
    buyer
) {
    db
        .query(getMarketItemText, [marketID])
        .then(res => {
            db
                .query(buyMarketItemText, [marketID])
                .catch(e => console.error(e))
            db
                .query(addUserAssetText, [res.rows[0].assetid, buyer])
                .catch(e => console.error(e))
            db
                .query(deleteUserAssetText, [res.rows[0].assetid, res.rows[0].owner, res.rows[0].assetidinusertable])
                .catch(e => console.error(e))
        })
}

async function deleteMarketItem(
    owner,
    marketID
) {
    db
        .query(deleteMarketItemText, [marketID, owner])
        .catch(e => console.error(e))
}

async function getAllAssetMarketItems() {
    let assets = await db
            .query(getAllAssetMarketItemsText, [])
            .then(res => {
                return res.rows
            })
    for (let i = 0; i < assets.length; i++) {
        let url = await getAssetImage(assets[i].assetid)
        assets[i].url = url
    }
    return assets;
}

async function getUserUnsoldMarketItems(owner) {
    let assets = await db
            .query(getUserUnsoldMarketItemsText, [owner])
            .then(res => {
                return res.rows
            })
    for (let i = 0; i < assets.length; i++) {
        let url = await getAssetImage(assets[i].assetid)
        assets[i].url = url
    }
    return assets;
}

async function getUserSoldMarketItems(owner) {
    return await db
            .query(getUserSoldMarketItemsText, [owner])
            .then(res => {
                return res.rows
            })
}

const getIsUserAssetText = 'SELECT * FROM userAssets WHERE userAddress=$1 AND assetID=$2'
const createMarketItemText = "INSERT INTO marketAssetItem (assetID, assetIDInUserTable, owner, buyer, price, sold) VALUES($1, $2, $3, '0', $4, false)"
const MarketItemText = "DELETE FROM marketAssetItem WHERE id=$1"
const getAllAssetMarketItemsText = 'SELECT * FROM marketAssetItem WHERE sold=false'
const getUserUnsoldMarketItemsText = 'SELECT * FROM marketAssetItem WHERE sold=false AND owner=$1'
const getUserSoldMarketItemsText = 'SELECT * FROM marketAssetItem WHERE sold=true AND owner=$1'
const getMarketItemText = 'SELECT * FROM marketAssetItem WHERE id=$1'
const deleteMarketItemText = 'DELETE FROM marketAssetItem WHERE id=$1 AND owner=$2'
const deleteUserAssetText = 'DELETE FROM userAssets WHERE assetID=$1 AND userAddress=$2 AND id=$3'
const addUserAssetText = 'INSERT INTO userAssets (assetID, userAddress) VALUES($1, $2)'

module.exports = {
    addAssetMarketItem,
    getAllAssetMarketItems,
    getUserSoldMarketItems,
    getUserUnsoldMarketItems,
    buyAssetMarketItem,
    deleteMarketItem
}