const db = require('../../../../db/db.js')

async function getUserAssetByPart(
    part,
    owner
) {
    const userAssets = await db.query(getUserAssetText, [owner]).then(res => {return res.rows})
    let assetsByPart = []
    for (let i = 0; i < userAssets.length; i++) {
        await db.query(getAssetPartText, [userAssets[i].assetid, part])
            .then(res => {
                if (res.rowCount != 0) {
                    assetsByPart.push(userAssets[i])
                }
            })
    }
    return assetsByPart;
}

const getUserAssetText = 'SELECT * FROM userassets WHERE useraddress=$1'
const getAssetPartText = 'SELECT * FROM assets WHERE id=$1 AND part=$2'

module.exports = {
    getUserAssetByPart
}