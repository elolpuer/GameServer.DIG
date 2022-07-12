const db = require("../../db/db.js")
const config = require("config")

const augmentAmount = config.get("augmentAmount")

async function buyAugmentations(
    augmentations,
    address
) {
    for (let i = 0; i < augmentations.length; i++) {
        const text = 'UPDATE augmentations SET amount=(amount + $1) WHERE id=$2 AND owner=$3'
        const values = [parseInt(augmentations[i].amount), augmentations[i].id, address]
        await db
            .query(text, values)
            .catch(e => console.log(e.stack))
    }
}

async function buyThings(
    things,
    address
) {
    for (let i = 0; i < things.length; i++) {
        const text = 'UPDATE things SET amount=(amount + $1) WHERE id=$2 AND owner=$3'
        const values = [parseInt(things[i].amount), things[i].id, address]
        await db
            .query(text, values)
            .catch(e => console.log(e.stack))
    }
}

async function buyResources(
    resources,
    address
) {
    for (let i = 0; i < resources.length; i++) {
        const text = 'UPDATE resources SET amount=(amount + $1) WHERE id=$2 AND owner=$3'
        const values = [parseInt(resources[i].amount), resources[i].id, address]
        await db
            .query(text, values)
            .catch(e => console.log(e.stack))
    }
}

module.exports = {
    buyAugmentations,
    buyThings,
    buyResources
}