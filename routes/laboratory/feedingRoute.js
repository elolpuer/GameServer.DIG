const {Router} = require("express")

const router = Router();

const {
    getNumAbilities,
    getAlwaysNumAbilities,
    feeding
} = require("../../service/laboratory/feedingService.js")

//gets feeding page
router.route("/laboratory/feeding")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                res.render(
                    "./laboratory/feeding",
                    {
                        title: "Feeding",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        abilities: false
                    }
                )
            }
        }
    )
    .post(
        async (req, res) => {
            //get initial abilities
            let alwaysAbilities = await getAlwaysNumAbilities(req.body.card)
            //get real abilities
            let numAbilities = await getNumAbilities(req.body.card)
            res.render(
                "./laboratory/feeding", //render page
                {
                    title: "Feeding",
                    abilities: true,
                    haveUser: true,
                    userAddress: req.session.user.address,
                    alwaysAbilities,
                    numAbilities
                }
            )
        }
    )

//feeding
router.route("/laboratory/feeding/feed")
    .post(
        async (req, res) => {
            await feeding(req.body.card)
            res.redirect("./")
        }
    )

module.exports = router