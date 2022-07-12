const db = require("../db/db.js")

//catch psycho
async function addPsycho(
    address,
    soil
) {
    //randomly adding asset
    db
        .query("SELECT * FROM assets", [])
        .then(res => {
            const randAsset = Math.floor(Math.random() * res.rowCount) + 1
            const text = 'INSERT INTO "psychospheres" ("owner", "open", "looted", "assetid") VALUES($1, $2, $3, $4)'
            const values = [address, false, false, randAsset]
            db
                .query(text, values)
                .catch(e => console.error(e.stack))
        })
    //adding substrate of this soli
    db
        .query("SELECT * FROM substrate WHERE soil=$1 AND owner=$2", [soil, address])
        .then(res => {
            if (res.rowCount == 0) {
                db
                    .query("INSERT INTO substrate (soil, amount, owner) VALUES($1, $2, $3)", [soil, 0.25, address])
                    .catch(e => console.error(e))
            } else {
                db
                    .query("UPDATE substrate SET amount=amount+0.25 WHERE soil=$1 AND owner=$2", [soil, address])
                    .catch(e => console.error(e))
            }
        })
}

//get all user psycho
async function getPsycho(
    address
) {
    const text = 'SELECT * FROM psychospheres WHERE owner=$1 ORDER BY open DESC'
    const values = [address]
    let psychospheres = 
        await db
            .query(text, values)
            .then((res) => {
                    for (let i=0; i < res.rowCount; i++){
                        if (res.rows[i].open == false) {
                            res.rows[i].assetid = 0;
                        }
                    }
                    return res.rows
            })
    return psychospheres;
}

//open psycho
async function openPsycho(
    id,
    address
) {
    console.log(address)
    console.log(id)
    db
        .query(getMarketItemText, [id])
        .then(async(res) => {
            if (res.rowCount == 0) {
                const text = 'UPDATE psychospheres SET open=true WHERE id=$1 AND owner=$2'
                const values = [parseInt(id), address]
                await db.query(text, values).catch(e => console.error(e))
            }
        })
}

//loot asset
async function lootPsycho(
    id,
    address
) {
    db
        .query(getMarketItemText, [id])
        .then(async(res) => {
            //checks if not on market
            if (res.rowCount == 0) {
                const text = 'UPDATE psychospheres SET looted=true WHERE id=$1 AND owner=$2'
                const values = [parseInt(id), address]
                await db
                    .query(text, values)
                    .then(() => {
                        const selectPsychoText = 'SELECT * FROM psychospheres WHERE id=$1 AND owner=$2'
                        db
                            .query(selectPsychoText, values)
                            .then((res) => {
                                //add asset
                                const textAsset = 'INSERT INTO "userassets" ("assetid", "useraddress") VALUES($1, $2)'
                                const valuesAsset = [res.rows[0].assetid, address]
                                db
                                    .query(textAsset, valuesAsset)
                                    .catch(e => console.error(e))
                                //delete used psychosphere
                                const textDelete = 'DELETE FROM psychospheres WHERE id=$1'
                                const valuesDelete = [res.rows[0].id]
                                db
                                    .query(textDelete, valuesDelete)
                                    .catch(e => console.error(e))
                            })
                            .catch(e => console.error(e))
                    })
                    .catch(e => console.error(e))
            }
        })
}

const getMarketItemText = 'SELECT * FROM marketPsychoItem WHERE psychoid=$1'

module.exports = {
    addPsycho,
    getPsycho,
    openPsycho,
    lootPsycho
}