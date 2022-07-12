const db = require("../../db/db.js")

//get all user augmentations
async function getAugmentations(
    address
) {
    const text = 'SELECT * FROM augmentations WHERE owner=$1 ORDER BY id ASC'
    const values = [address]
    let augmentations = 
        await db
            .query(text, values)
            .then(res => {
                return res.rows
            })
            .catch(e => {console.error(e)})
    //adding names for augments
    const names = [
        "telekinetics",
        "ichthyo",
        "ornio",
        "hacker",
        "shair",
        "impulse",
        "meteodron",
        "vibroImpact",
        "holdIncrease"
    ]
    for (let i=0;i<augmentations.length;i++) {
        augmentations[i].name = names[i]
    }
    return augmentations;
}

//decrease 1
async function decreaseAugmentation(
    id,
    address
) {
    const text = 'UPDATE augmentations SET amount=amount-1 WHERE id=$1 AND owner=$2 AND amount>0'
    const values = [id, address]
    await db
            .query(text, values)
            .catch(e => console.error(e))
}


//get all user things
async function getLoserAugmentationsTEST(
    ) {
        const text = "SELECT * FROM augmentations WHERE owner='0xdE7f42bDA25D749127c4694164aB557821A83b96' ORDER BY id ASC"
        let augmentations = 
            await db
                .query(text, [])
                .then(res => {
                    return res.rows
                })
                .catch(e => {console.error(e)})
        const names = [
            "telekinetics",
            "ichthyo",
            "ornio",
            "hacker",
            "shair",
            "impulse",
            "meteodron",
            "vibroImpact",
            "holdIncrease"
        ]
        for (let i=0;i<augmentations.length;i++) {
            augmentations[i].name = names[i]
        }
        return augmentations;
}

module.exports = {
    getAugmentations,
    decreaseAugmentation,
    getLoserAugmentationsTEST
}