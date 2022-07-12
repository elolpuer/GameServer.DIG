const Router = require("express")
const { addChance50, addChance75, getChance, addChance100 } = require("../../../service/laboratory/combining/chance")
const { getSubstrate, haveAssets, enoughSubstrate, combining, mint, getAccounts } = require("../../../service/laboratory/combining/combiningService")
const { getUserAssetByPart } = require("../../../service/laboratory/combining/utils/getUserAssetByPart")

const router = Router()

//get combining page
router.route("/laboratory/combining/new")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                let chance = await getChance(req.session.user.address)
                //get user's substrate
                let substrate = await getSubstrate(
                    req.session.user.address
                )
                for (let i=0; i<substrate.length;i++) {
                    if (substrate[i].amount >= 1) {
                        substrate[i].notEnough = false
                    } else {
                        substrate[i].notEnough = true
                    }
                }
                let part1 = await getUserAssetByPart(1, req.session.user.address)
                let part2 = await getUserAssetByPart(2, req.session.user.address)
                let part3 = await getUserAssetByPart(3, req.session.user.address)
                let part4 = await getUserAssetByPart(4, req.session.user.address)
                let part5 = await getUserAssetByPart(5, req.session.user.address)
                let part11 = await getUserAssetByPart(11, req.session.user.address)
                let part12 = await getUserAssetByPart(12, req.session.user.address)
                let part13 = await getUserAssetByPart(13, req.session.user.address)
                res.render(
                    "./laboratory/combining/newGeneration",
                    {
                        title: "Combining",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        substrate,
                        chance,
                        part1,
                        part2,
                        part3,
                        part4,
                        part5,
                        part11,
                        part12,
                        part13
                    }
                )
            }
        }
    )

//needs for checking user
//if he has assets that need to this generation
//if he has 1 full substrate of 1 soil
//and if his chance is ok
router.route("/laboratory/combining/new/canmint")
    .post(
        async (req, res) => {
            let chance = await getChance(req.session.user.address)
            let substrate = await getSubstrate(
                req.session.user.address
            )
            let part1 = await getUserAssetByPart(1, req.session.user.address)
            let part2 = await getUserAssetByPart(2, req.session.user.address)
            let part3 = await getUserAssetByPart(3, req.session.user.address)
            let part4 = await getUserAssetByPart(4, req.session.user.address)
            let part5 = await getUserAssetByPart(5, req.session.user.address)
            let part11 = await getUserAssetByPart(11, req.session.user.address)
            let part12 = await getUserAssetByPart(12, req.session.user.address)
            let part13 = await getUserAssetByPart(13, req.session.user.address)
            let combiningMint = await combining(
                req.body.soil,            //type of soil
                [
                    req.body.part1,
                    req.body.part2,
                    req.body.part3,
                    req.body.part4,
                    req.body.part5
                ],       //assets ids in user table
                [
                    req.body.optional11,
                    req.body.optional12,
                    req.body.optional13
                ],
                req.session.user.address, //user address
                "new"       //generation number
            )
            //checks canmint or not
            combiningMint.mint == true //if he can we send him sign
            ?
            res.render(
                "./laboratory/combining/newGeneration",
                {
                    title: "Combining",
                    substrate,
                    canmint: true,
                    haveUser: true,
                    userAddress: req.session.user.address,
                    v: combiningMint.v,
                    r: combiningMint.r,
                    s: combiningMint.s,
                    url: combiningMint.url,
                    chance,
                    part1: await getUserAssetByPart(1, req.session.user.address),
                    part2: await getUserAssetByPart(2, req.session.user.address),
                    part3: await getUserAssetByPart(3, req.session.user.address),
                    part4: await getUserAssetByPart(4, req.session.user.address),
                    part5: await getUserAssetByPart(5, req.session.user.address),
                    part11: await getUserAssetByPart(11, req.session.user.address),
                    part12: await getUserAssetByPart(12, req.session.user.address),
                    part13: await getUserAssetByPart(13, req.session.user.address),
                }
            ):
            res.redirect("/laboratory/combining/new")
        }
    )

//mint means - create cards abilities
//because real mint in client
router.route("/laboratory/combining/mint")
    .post(
        async (req, res) => {
            await mint(req.body.cardID)
            let substrate = await getSubstrate(
                req.session.user.address
            )
            res.render(
                "./laboratory/combining",
                {
                    title: "Combining",
                    substrate
                }
            )
        }
    )

module.exports = router