const {Router} = require("express")
const { getMaxAbility } = require("../service/cards/cardService")
const { addOneToAll } = require("../service/loserTestService")
const router = Router()


// router.route("/")
//     .get(
//         async (req, res) => {
//             res.render(
//                 "index",
//                 {
//                     title: "Index",
//                     haveUser: req.session.user == null ? false : true,
//                     userAddress: req.session.user == null ? '' : req.session.user.address,
//                 }
//             )
//         }
//     )

router.route("/inventory/addloser")
    .post(
        async (req, res) => {
            await addOneToAll()
            res.redirect("/pvp")
        }
    )

module.exports = router