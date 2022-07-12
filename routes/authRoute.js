const {Router} = require('express');

const {
    addInitialAugment,
    addInitialResource,
    addInitialThing,
    addInitialUsername
} = require("../service/authService.js")

const router = Router();

//login
router.route("/login")
    .post(
        async (req, res) => {
            //adding initial inventory
            await addInitialAugment(req.body.address);
            await addInitialResource(req.body.address);
            await addInitialThing(req.body.address);
            //adding initial name (username - address)
            let user = await addInitialUsername(req.body.address);
            req.session.user = user;
            res.sendStatus(200)
        }
    )

//logout
router.route("/logout")
    .post(
        async (req, res) => {
            req.session.destroy()
            res.redirect('/')
        }
    )


module.exports = router;