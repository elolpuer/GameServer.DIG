const db = require("../../db/db.js")

//get all user resources
async function getResources(
    address
) {
    const text = 'SELECT * FROM resources WHERE owner=$1 ORDER BY id ASC'
    const values = [address]
    let resources = 
        await db
            .query(text, values)
            .then(res => {
                return res.rows
            })
            .catch(e => {console.error(e)})
    //add names to resources
    const names = [
        "lymph",
        "ash",
        "flowerum",
        "electron"
    ]
    for (let i = 0; i< resources.length; i++) {
        resources[i].name = names[i];
    }
    return resources;
}

//decrease for 1
async function decreaseResource(
    id,
    address
) {
    const text = 'UPDATE resources SET amount=amount-1 WHERE id=$1 AND owner=$2 AND amount>0'
    const values = [id, address]
    await db
            .query(text, values)
            .catch(e => console.error(e))
}

//get all user things
async function getLoserResourcesTEST(
    ) {
        const text = "SELECT * FROM resources WHERE owner='0xdE7f42bDA25D749127c4694164aB557821A83b96' ORDER BY id ASC"
        let resources = 
            await db
                .query(text, [])
                .then(res => {
                    return res.rows
                })
                .catch(e => {console.error(e)})
        //add names to resources
        const names = [
            "lymph",
            "ash",
            "flowerum",
            "electron"
        ]
        for (let i = 0; i< resources.length; i++) {
            resources[i].name = names[i];
        }
        return resources;
}

module.exports = {
    getResources,
    decreaseResource,
    getLoserResourcesTEST
}