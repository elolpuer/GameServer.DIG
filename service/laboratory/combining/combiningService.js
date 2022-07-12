const db = require("../../../db/db.js")
const config = require("config")
const e = require("express")
const Web3 = require("web3")
require('dotenv').config()

const mnemonic = process.env.MNEMONIC
const soilTypesAmount = config.get("soilTypesAmount")

const {
    getChance, updateChance25
} = require("./chance.js")

const {
    haveAssets,
    enoughSubstrate
} = require("./checkers.js")

//get user substrate (all soils)
async function getSubstrate(
    owner
) {
    let substrate =
            await db
                .query(getSubstrateText, [owner])
                .then(res => {return res.rows})
    return substrate
}

//main function for combining
async function combining(
    soil,
    assetIDs,
    optionalAssetIDs,
    owner,
    generationType   //name
) {
    //checks if have needed assets
    let assets = await haveAssets(owner, assetIDs, optionalAssetIDs, generationType)
    //get chance (usual 25%)
    let chance = await getChance(owner)
    //checks if enough substrate of this soil
    let enoughSubstrateToCombine = await enoughSubstrate(soil, owner)
    //create random number
    const rand = Math.floor((Math.random() * 10 **10)) % 100
    //for example if user have chance 25% and rand number 51 he cant mint
    //or if he have chance 75% and rand number 51 he can mint
    if ((rand <= chance) && enoughSubstrateToCombine && assets) {
        for (let i=0; i< assetIDs.length; i++) {
            //delete this user assets
            await db
                .query(deleteUserAssets, [owner, assetIDs[i]])
                .catch(e => console.error(e))
        }
        for (let i=0; i< optionalAssetIDs.length; i++) {
            //delete this user assets
            await db
                .query(deleteUserAssets, [owner, optionalAssetIDs[i]])
                .catch(e => console.error(e))
        }
        //and substrate -1
        await db
            .query(deleteSubstrateText, [soil, owner])
            .catch(e => console.error(e))
        const options = {
            networkCheckTimeout: 999999,
            network_id: 97, // Ropsten's id
            gas: 5500000, // Ropsten has a lower block limit than mainnet
            skipDryRun: true // Skip dry run before migrations? (default: false for public nets )
        }
        const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://data-seed-prebsc-1-s1.binance.org:8545"))
        // const web3 = new HDWalletProvider(mnemonic, webSocketProvider);
        //signing transaction
        // const web3 = new Web3("http://127.0.0.1:7545")
        //contract address
        //const contractAddress = config.get("DIG");
        const contractAddress = '0x1514dC8D47BfC45442387D1f985702e10e2fCDF0'
        //image
        const url = 'https://ipfs.io/ipfs/QmUdTP3VBY5b9u1Bdc3AwKggQMg5TQyNXVfzgcUQKjdmRH'
        //create message with contract address and url
        const message = web3.utils.soliditySha3(
            contractAddress,
            url,
            owner);
        //sign from owner address
        const sign = await web3.eth.accounts.sign(message, '5c42501c0cf8fe6f1a2b6604b04804d1fd4ffc926082dfbaefff86f5ca1c0bf0')
        //divide sign
        // const r = sign.r
        // const s = sign.s
        // let v = sign.v
        await updateChance25(owner)
        return {mint: true, v:sign.v, r:sign.r, s:sign.s, url:url};
    } else if (enoughSubstrateToCombine && assets) {
        await updateChance25(owner)
        for (let i=0; i< assetIDs.length; i++) {
            //delete this user assets
            await db
                .query(deleteUserAssets, [owner, assetIDs[i]])
                .catch(e => console.error(e))
        }
        for (let i=0; i< optionalAssetIDs.length; i++) {
            if (optionalAssetIDs[i] != '') {
                //delete this user assets
                await db
                    .query(deleteUserAssets, [owner, optionalAssetIDs[i]])
                    .catch(e => console.error(e))
            }
        }
        return {mint: false, v: "", r: "", s: "", url: ""};
    } else {
        await updateChance25(owner)
        return {mint: false, v: "", r: "", s: "", url: ""};
    }
}

//create card abilities
async function mint(
    cardID
) {
    //array for amount of num abilities
    for (let i = 1; i <= config.get("numAbilityAmount"); i++) {
        //create rand
        const rand = Math.floor((Math.random() * 10 **10) + 1) % 10
        db
            .query(createNumAbility, [i, rand, cardID])
            .catch(e => console.error(e))
        db
            .query(createAlwaysAbility, [i, rand, cardID])
            .catch(e => console.error(e))
    }
    for (let i = 1; i <= config.get("boolAbilityAmount"); i++) {
        //create rand
        const rand = Math.floor((Math.random() * 10 **10) + 1) % 10
        const value = rand > 5 ? false : true;
        db
            .query(createBoolAbility, [i, value, cardID])
            .catch(e => console.error(e))
    }
}



const getSubstrateText = "SELECT * FROM substrate WHERE owner=$1 ORDER BY soil ASC"
const deleteSubstrateText = "UPDATE substrate SET amount=amount-1 WHERE soil=$1 AND owner=$2"
const getChanceText = "SELECT chance FROM combiningchance WHERE useraddress=$1"
const addChanceText = 'INSERT INTO combiningchance (useraddress, chance) VALUES($1, $2)'
const updateChanceText = 'UPDATE combiningchance SET chance=$1 WHERE useraddress=$2'

const createNumAbility = 'INSERT INTO cardNumAbilities (id, value, cardid) VALUES($1, $2, $3)'
const createAlwaysAbility = 'INSERT INTO cardAlwaysNumAbilities (id, value, cardid) VALUES($1, $2, $3)'
const createBoolAbility = 'INSERT INTO cardBoolAbilities (id, value, cardid) VALUES($1, $2, $3);'
const deleteUserAssets = "DELETE FROM userassets WHERE useraddress=$1 AND id=$2"

module.exports = {
    getSubstrate,
    combining,
    mint
}
