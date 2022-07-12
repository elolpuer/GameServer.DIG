const config = require('config');
const {Router} = require('express');
const path = require('path');

const router = Router();

//sending DBT contract abi
router.route("/getDBT")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            }
            res.sendFile("/home/egor/Документы/WorkplaceSmartContracts/digitalgolems_with_server/build/contracts/Digibytes.json")
        }
    )

//sending DIG contract abi
router.route("/getDIG")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            }
            res.sendFile("/home/egor/Документы/WorkplaceSmartContracts/card_game/build/contracts/DigitalGolems.json")
        }
    )

//sending Rent contract abi
router.route("/getRent")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            }
            res.sendFile("/home/egor/Документы/WorkplaceSmartContracts/card_game/build/contracts/Rent.json")
        }
    )

module.exports = router
