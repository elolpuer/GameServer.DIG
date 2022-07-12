const {Router} = require('express');
const config = require('config')

const db = require("../db/db.js")

const {
    addPsycho,
    getPsycho
} = require("../service/psychoService.js")
const {changeUsername} = require("../service/userService.js")

const router = Router();

//get user page
router.route("/user")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                res.render(
                    "user",
                    {
                        title: "User",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        username: req.session.user.username
                    }
                )
            }
        }
    )

//change username
router.route("/user/name")
    .post(
        async (req, res) => {
            await changeUsername(
                req.body.username,
                req.session.user.address
            )
            req.session.user.username = req.body.username;
            res.redirect("/user")
        }
    )

module.exports = router