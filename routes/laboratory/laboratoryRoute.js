const {Router} = require("express")

const router = Router();

//get lab page
router.route("/laboratory")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                res.render(
                    "./laboratory/laboratory",
                    {
                        title: "Laboratory",
                        haveUser: true,
                        userAddress: req.session.user.address,
                    }
                )
            }
        }
    )

module.exports = router