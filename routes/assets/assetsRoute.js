const {Router} = require('express');

const {
    getAssets, addLoserTEST
} = require("../../service/assets/assetsService.js")

const router = Router();

router.route("/assets")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                //gets all user's assets
                let assets = await getAssets(
                    req.session.user.address
                )
                res.render(
                    "assets",
                    {
                        title: "Assets",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        assets
                    }
                )
            }
        }
    )

router.route("/assets/addloser")
    .post(
        async (req, res) => {
            await addLoserTEST()
            res.redirect("/pvp")
        }
    )

module.exports = router;