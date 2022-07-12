const {Router} = require("express")
const { addPsychoMarketItem, buyPsychoMarketItem, getAllPsychoMarketItems, deleteMarketItem, getOwnerPsychoMarketItems } = require("../../service/market/psychoMarketService")
const router = Router()

//gets psycho market page
router.route("/market/psycho")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                //get all psycho on market
                let userItems = await getOwnerPsychoMarketItems(req.session.user.address)
                let items = await getAllPsychoMarketItems()
                res.render(
                    "./market/psychoMarket",
                    {
                        title: "Psycho Market",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        items,
                        userItems
                    }
                )
            }
            
        }
    )

//sell psycho
router.route("/market/psycho/sell")
    .post(
        async (req, res) => {
            if (req.body.price == "0") {
                res.redirect("./")
            }
            await addPsychoMarketItem(
                req.session.user.address,
                req.body.psychoID,
                req.body.price
            )
            res.redirect("/market/psycho")
        }
    )

//buy psycho
router.route("/market/psycho/buy")
    .post(
        async (req, res) => {
            await buyPsychoMarketItem(
                req.body.marketID,
                req.body.buyer
            )
            res.redirect("/market/psycho")
        }
    )

router.route('/market/psycho/delete')
    .post(
        async (req, res) => {
            await deleteMarketItem(
                req.session.user.address,
                req.body.marketID
            )
            res.redirect("/market/psycho")
        }
    )

module.exports = router