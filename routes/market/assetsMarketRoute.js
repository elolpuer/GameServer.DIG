const {Router} = require("express")
const { getAllAssetMarketItems, addAssetMarketItem, buyAssetMarketItem, deleteMarketItem, getUserUnsoldMarketItems } = require("../../service/market/assetsMarketService")
const router = Router()

//get assets market page
router.route("/market/assets")
    .get(
        async(req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                //gets all assets on market
                let userItems = await getUserUnsoldMarketItems(req.session.user.address)
                let items = await getAllAssetMarketItems()
                res.render(
                    "./market/assetsMarket",
                    {
                        title: "Assets Market",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        items,
                        userItems
                    }
                )
            }
            
        }
    )

//sell assets
//(sending to market)
router.route("/market/assets/sell")
    .post(
        async (req, res) => {
            if (req.body.price == "0") {
                res.redirect("/assets")
            }
            await addAssetMarketItem(
                req.session.user.address,
                req.body.assetUserID,
                req.body.assetID,
                req.body.price
            )
            res.redirect("/assets")
        }
    )

//buying asset
router.route("/market/assets/buy")
    .post(
        async (req, res) => {
            await buyAssetMarketItem(
                req.body.marketID,
                req.body.buyer
            )
            res.redirect("/assets")
        }
    )

router.route('/market/assets/delete')
    .post(
        async (req, res) => {
            await deleteMarketItem(
                req.session.user.address,
                req.body.marketID
            )
            res.redirect("/market/assets")
        }
    )

module.exports = router