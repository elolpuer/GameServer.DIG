const e = require("express");
const {Router} = require("express");
const { 
    startConservation, 
    getConservation, 
    mockTime,
    endConservation
} = require("../../service/laboratory/conservationService.js");

const router = Router();

const {
    getAlwaysNumAbilities,
} = require("../../service/laboratory/feedingService.js")


//get conservation page
router.route("/laboratory/conservation")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                //get if card has conservation
                let conservation = await getConservation(
                    req.body.card
                )
                let id, cardid, whenended
                //if conservation not exist sending 0 data
                //else send ability id, cardid and when conservation ended
                if (conservation == null) {
                    id = 0
                    cardid = 0
                    whenended = 0
                } else {
                    id = conservation.id
                    cardid = conservation.cardid
                    whenended = conservation.whenended
                }
                res.render(
                    "./laboratory/conservation",
                    {
                        title: "Conservation",
                        abilities: false,
                        haveUser: true,
                        userAddress: req.session.user.address,
                        conservationAbility: id,
                        conservationCardID: cardid,
                        conservationWhenEnded: whenended
                    }
                )
            }
        }
    )
    .post(
        async (req, res) => {
            //get initial abilities
            let alwaysAbilities = await getAlwaysNumAbilities(req.body.card)
            //get conservation
            let conservation = await getConservation(
                req.body.card
            )
            let id, cardid, whenended
            if (conservation == null) {
                id = 0
                cardid = 0
                whenended = 0
            } else {
                id = conservation.id
                cardid = conservation.cardid
                whenended = conservation.whenended
            }
            res.render(
                "./laboratory/conservation",
                {
                    title: "Conservation",
                    abilities: true,
                    haveUser: true,
                    userAddress: req.session.user.address,
                    alwaysAbilities,
                    conservationAbility: id,
                    conservationCardID: cardid,
                    conservationWhenEnded: whenended,
                    cardID: req.body.card
                }
            )
        }
    )

//send to conservation
router.route("/laboratory/conservation/conserve")
    .post(
        async (req, res) => {
            console.log(req.body.card)
            await startConservation(req.body.card, req.body.ability)
            res.redirect("./")
        }
    )

//ending conservation
router.route("/laboratory/conservation/end")
    .post(
        async (req, res) => {
            await endConservation(req.body.card)
            res.redirect("./")
        }
    )

//needs for testing
//mock first card conservation time
router.route("/laboratory/conservation/mocktime")
    .get(
        async (req, res) => {
            await mockTime(req.query.id)
            res.redirect("./")
        }
    )

module.exports = router