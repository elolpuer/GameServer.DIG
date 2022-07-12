const Router = require("express")
const { addChance50, addChance75, getChance, addChance100 } = require("../../service/laboratory/combining/chance")
const { getSubstrate, haveAssets, enoughSubstrate, combining, mint, getAccounts } = require("../../service/laboratory/combining/combiningService")

const router = Router()

//get combining page
router.route("/laboratory/combining")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                res.render(
                    "./laboratory/combining",
                    {
                        title: "Combining",
                        haveUser: true,
                        userAddress: req.session.user.address
                    }
                )
            }
        }
    )


router.route("/laboratory/combining/chance50")
    .post(
        async (req, res) => {
            await addChance50(req.body.address)
        }
    )

router.route("/laboratory/combining/chance75")
    .post(
        async (req, res) => {
            await addChance75(req.body.address)
        }
    )

router.route("/laboratory/combining/chance100")
    .get(
        async (req, res) => {
            await addChance100(req.session.user.address)
            res.redirect("/laboratory/combining")
        }
    )

module.exports = router