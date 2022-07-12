const db = require("../../db/db.js")

//losing assets
async function loseAssets(
    winner,
    loser
) {
    db
        .query(getUserAssetsText, [loser])
        .then(res => {
            for (let i = 0; i < res.rowCount; i++) {
                if ((i % 2) != 0) {
                    db
                        .query(deleteUserAssets, [res.rows[i].id])
                        .catch(e => console.error(e))
                    db
                        .query(addUserAssets, [winner, res.rows[i].assetid])
                }
            }
        })
}

const getUserAssetsText = 'SELECT * FROM userAssets WHERE userAddress=$1'
const deleteUserAssets = 'DELETE FROM userAssets WHERE id=$1'
const addUserAssets = 'INSERT INTO userAssets (useraddress, assetid) VALUES($1, $2)'

module.exports = {loseAssets}