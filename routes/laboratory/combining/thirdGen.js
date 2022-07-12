const Router = require("express")
const { addChance50, addChance75, getChance, addChance100 } = require("../../../service/laboratory/combining/chance")
const { getSubstrate, haveAssets, enoughSubstrate, combining, mint, getAccounts } = require("../../../service/laboratory/combining/combiningService")
const { getUserAssetByPart } = require("../../../service/laboratory/combining/utils/getUserAssetByPart")

const router = Router()

//get combining page
router.route("/laboratory/combining/third")
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
                let part7 = await getUserAssetByPart(7, req.session.user.address)
                let part8 = await getUserAssetByPart(8, req.session.user.address)
                let part9 = await getUserAssetByPart(9, req.session.user.address)
                let part10 = await getUserAssetByPart(10, req.session.user.address)
                res.render(
                    "./laboratory/combining/thirdGeneration",
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
                        part7,
                        part8,
                        part9,
                        part10
                    }
                )
            }
        }
    )

//needs for checking user
//if he has assets that need to this generation
//if he has 1 full substrate of 1 soil
//and if his chance is ok
router.route("/laboratory/combining/third/canmint")
    .post(
        async (req, res) => {
            let chance = await getChance(req.session.user.address)
            let substrate = await getSubstrate(
                req.session.user.address
            )
            let combiningMint = await combining(
                req.body.soil,            //type of soil
                [
                    req.body.part1,
                    req.body.part2,
                    req.body.part3,
                    req.body.part4,
                    req.body.part5,
                    req.body.part7,
                    req.body.part8,
                    req.body.part9,
                    req.body.part10
                ],       //assets ids in user table
                [],
                req.session.user.address, //user address
                "third"       //generation number
            )
            //checks canmint or not
            combiningMint.mint == true //if he can we send him sign
            ?
            res.render(
                "./laboratory/combining/thirdGeneration",
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
                    part7: await getUserAssetByPart(7, req.session.user.address),
                    part8: await getUserAssetByPart(8, req.session.user.address),
                    part9: await getUserAssetByPart(9, req.session.user.address),
                    part10: await getUserAssetByPart(10, req.session.user.address)
                }
            ):
            res.redirect("/laboratory/combining/third")
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