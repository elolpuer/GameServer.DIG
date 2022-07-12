const db = require("../db/db.js")
const config = require("config")

const augmentations = config.get("augmentAmount")
const things = config.get("thingsAmount")
const resources = config.get("resourcesAmount") 

async function addOneToAll() {
    for (let i = 0; i < augmentations; i++) {
        const text = 'UPDATE augmentations SET amount=10 WHERE id=$1 AND owner=$2'
        const values = [i, '0xdE7f42bDA25D749127c4694164aB557821A83b96']
        await db
            .query(text, values)
            .catch(e => console.log(e.stack))
    }
    for (let i = 0; i < things; i++) {
        const text = 'UPDATE things SET amount=10 WHERE id=$1 AND owner=$2'
        const values = [i, '0xdE7f42bDA25D749127c4694164aB557821A83b96']
        await db
            .query(text, values)
            .catch(e => console.log(e.stack))
    }
    for (let i = 0; i < resources; i++) {
        const text = 'UPDATE resources SET amount=10 WHERE id=$1 AND owner=$2'
        const values = [i, '0xdE7f42bDA25D749127c4694164aB557821A83b96']
        await db
            .query(text, values)
            .catch(e => console.log(e.stack))
    }
}

module.exports = {
    addOneToAll
}