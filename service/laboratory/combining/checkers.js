const db = require("../../../db/db.js")
const config = require("config")
require('dotenv').config()

//checks if user have enough substrate of this soil type
//for combining
async function enoughSubstrate(
    soil,
    owner
) {
    let amount = 
        await db
            .query(getEnoughSubstrateText, [owner, soil])
            .then(res => {return res.rows[0].amount})
    return amount >= 1;
}

//cheks user have enough assets for this generation type
async function haveAssets(
    owner,
    assetsIDs,
    optionalAssetIDs,
    generationType   //generation name
) {
    let generationParts = `${generationType}GenerationParts`;
    let generationOptionalParts = `${generationType}GenerationOptionalParts`
    //checks if assets not on market
    for(let i = 0; i < assetsIDs.length; i++) {
        let isExist = await db
            .query("SELECT * FROM marketAssetItem WHERE assetidinusertable=$1", [assetsIDs[i]])
            .then(res => {
                if (res.rowCount != 0) {
                    return true;
                } else {
                    return false;
                }
            })
        if (isExist == true) {
            return false;
        }
    }
    //get all user assets
    let userAssets = await db
            .query(getUserAssetText, [owner])
            .then(res => {
                return res.rows;
            })
    //flag for checking if user really have assets for combining
    let flag1 = [];
    assetsIDs.map( //for all assetsIDs array
        (value, i) => {
            //checks if user have this asset
            for (let j = 0; j < userAssets.length; j++) {
                if (userAssets[j].id == value) {
                    flag1[i] = userAssets[j].assetid
                } 
            }
        }
    )
    let flag2 = [];
    //get parts needed for this generation
    let getGenerationParts = config.get(generationParts)
    let flag3 = [];
    //this needs for checking if assets that user gave us
    //really parts that need for generation
    if(flag1.length == getGenerationParts.length) {
        // flag1 = flag1.sort()
        flag1 = flag1.map((x) => { 
            return parseInt(x, 10); 
        });
        //for each value in assetsIDs array 
        for (let i = 0; i < flag1.length; i++) {
            flag3[i] = await db
                .query(getAssetPartText, [flag1[i]]) //get part of this asset
                .then(res => {
                    //checks if part and type of asset really right
                    if (res.rows[0].part == getGenerationParts[i]){
                        return true;
                    } else {
                        return false;
                    }
                })
        }
    } else {
        return false;
    }
    return flag3.every(Boolean);
}

const getEnoughSubstrateText = "SELECT * FROM substrate WHERE owner=$1 AND soil=$2"
const getUserAssetText = 'SELECT * FROM userassets WHERE useraddress=$1'
const getAssetPartText = 'SELECT * FROM assets WHERE id=$1'

module.exports = {
    enoughSubstrate,
    haveAssets
}