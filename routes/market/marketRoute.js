const {Router} = require("express")
const router = Router()

//get market page
router.route("/market")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                res.render(
                    "./market/market",
                    {
                        title: "Market",
                        haveUser: true,
                        userAddress: req.session.user.address,
                    }
                )
            }
        }
    )

module.exports = router