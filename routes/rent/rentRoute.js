const {Router} = require("express")
const router = Router()

router.route("/rent")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect('/')
            }
            res.render(
                "./rent/rent",
                {
                    title: "Rent",
                    haveUser: true,
                    userAddress: req.session.user.address
                }
            )
        }
    )

module.exports = router;