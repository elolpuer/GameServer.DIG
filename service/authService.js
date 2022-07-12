const db = require("../db/db.js")
const config = require('config')

const thingsAmount = config.get("thingsAmount");
const resourcesAmount = config.get("resourcesAmount");
const augmentAmount = config.get("augmentAmount");

//initial functions needs for adding user to DB tables
async function addInitialAugment(
    address
) {
    db
        .query('SELECT * FROM "augmentations" WHERE owner=$1', [address])
        .then((res) => {
            if(res.rows.length == 0) {
                const text = 'INSERT INTO "augmentations" ("id","amount","owner") VALUES($1, $2, $3)'
                // const text = 'IF NOT EXISTS (SELECT 1 FROM augmentations WHERE address = $3) BEGIN INSERT INTO "augmentations" ("id","amount","address") VALUES($1, $2, $3) END'
                try {
                    for (let i = 0; i < augmentAmount; i++) {
                        const values = [i, 0, address]
                        db
                            .query(text, values)
                            .catch(e => console.error(e.stack))
                    }
                    return 200;
                } catch (error) {
                    return 400;
                }
            } 
        })
        .catch((e)=>console.error(e.stack))
}

async function addInitialResource(
    address
) {
    db
        .query('SELECT * FROM "resources" WHERE owner=$1', [address])
        .then((res) => {
            if(res.rows.length == 0) {
                const text = 'INSERT INTO "resources" ("id","amount","owner") VALUES($1, $2, $3)'
                try {
                    for (let i = 0; i < resourcesAmount; i++) {
                        const values = [i, 0, address]
                        db
                            .query(text, values)
                            .catch(e => console.error(e.stack))
                    }
                return 200;
                } catch (error) {
                    return 400;
                }           
            } 
        })
        .catch((e)=>console.error(e.stack))
    
}

async function addInitialThing(
    address
) {
    db
    .query('SELECT * FROM "things" WHERE owner=$1', [address])
    .then((res) => {
        if(res.rows.length == 0) {
            const text = 'INSERT INTO "things" ("id","amount","owner") VALUES($1, $2, $3)'
            try {
                for (let i = 0; i < thingsAmount; i++) {
                    const values = [i, 0, address]
                    db
                        .query(text, values)
                        .catch(e => console.error(e.stack))
                }
                return 200;
            } catch (error) {
                return 400;
            }
        }})
    .catch((e)=>console.error(e.stack))
}

//add initial username - user address
//also this returns session user
async function addInitialUsername(
    address
) {
    let user = 
            await db
                    .query('SELECT * FROM "users" WHERE address=$1', [address])
                    .then((res) => {
                        if(res.rows.length == 0) {
                            const text = 'INSERT INTO "users" ("address", "username") VALUES($1, $2)'
                            try {
                                const values = [address, address]
                                db
                                    .query(text, values)
                                    .catch(e => console.error(e.stack))
                                return 200;
                            } catch (error) {
                                return 400;
                            }
                        } else {
                            return res.rows[0]
                        }
                    })
                    .catch((e)=>console.error(e.stack))
    return user;
}

module.exports = {
    addInitialAugment,
    addInitialResource,
    addInitialThing,
    addInitialUsername
}