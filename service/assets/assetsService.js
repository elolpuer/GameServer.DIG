const db = require("../../db/db.js")

//get all user's assets
async function getAssets(
    address
) {
    //create query
    const text = 'SELECT * FROM userAssets WHERE userAddress=$1 ORDER BY assetid ASC'
    const values = [address]
    let userAssets = 
        await db
            .query(text, values) //send query
            .then(async (res) => {
                let assets = []
                //we have two table of assets in DB
                //first with assets values(e.g. url, type, part)
                //second with userassets (assetIDs)
                //so we create cycle for user's assets
                for (let i = 0; i < res.rowCount; i++) {
                    //create query - get user asset's values
                    const textGetAssets = 'SELECT * FROM assets WHERE id=$1'
                    const valuesGetAssets = [res.rows[i].assetid]
                    assets[i] = await db
                                        .query(textGetAssets, valuesGetAssets)
                                        .then(res => {
                                            return res.rows[0]
                                        })
                    //add asset id in user table
                    assets[i].assetIDInUserTable = res.rows[i].id
                }
                return assets
            })
    return userAssets;
}

async function getAssetImage(
    assetID
) {
    const image = await db.query("SELECT * FROM assets WHERE id=$1", [assetID])
        .then(res => {
            return res.rows[0].url
        })
    return image;
}

async function addLoserTEST() {
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 1])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 2])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 3])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 4])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 5])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 6])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 7])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 8])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 9])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 10])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 11])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 12])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 13])
    await db.query("INSERT INTO userassets (useraddress, assetid) VALUES($1, $2)", ['0xdE7f42bDA25D749127c4694164aB557821A83b96', 14])
}

module.exports = {
    getAssets,
    addLoserTEST,
    getAssetImage
}