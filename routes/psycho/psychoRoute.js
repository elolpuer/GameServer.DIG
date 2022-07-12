const {Router} = require('express');

const router = Router();

const {
    addPsycho,
    getPsycho,
    openPsycho,
    lootPsycho
} = require("../../service/psychoService.js");
const { decreaseNumAbility } = require('../../service/cards/cardService.js');

//get psycho page
router.route("/psycho")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                let psychospheres = await getPsycho(
                    req.session.user.address
                )
                res.render(
                    "psycho",
                    {
                        title: "Psycho",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        psychospheres
                    }
                )
            }
        }
    )

//open psycho
router.route("/psycho/open")
    .post(
        async (req, res) => {
            await openPsycho(
                req.query.id,
                req.session.user.address
            )
            res.redirect("/psycho")
        }
    )

//loot psycho's asset
router.route("/psycho/loot")
    .post(
        async (req, res) => {
            await lootPsycho(
                req.query.id,
                req.session.user.address
            )
            res.redirect("/assets")
        }
    )

//add psycho that user caught
router.route("/psycho/add")
    .post(
        async (req, res) => {
            await addPsycho(
                req.session.user.address,
                req.query.id //soil
            )
            await decreaseNumAbility(
                1 //cardID TESTING VALUE
            )
            res.redirect("/psycho")
        }
    )

module.exports = router