const {Router} = require("express")
const { writeWinnerWOPayoff, writeWinnerWPayoff, writeLoser, getWinAmount, getLoseAmount, getLoserTESTAssetsAmount } = require("../../service/pvp/pvpService")
const { getLoserAugmentationsTEST } = require("../../service/session/augmentService")
const { getLoserResourcesTEST } = require("../../service/session/resourcesService")
const { getLoserThingsTEST } = require("../../service/session/thingsService")
const router = Router()

//get pvp page
router.route("/pvp")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect('/')
            } else {
                let wins = await getWinAmount(req.session.user.address)
                let loses = await getLoseAmount(req.session.user.address)
                let loserAssetsAmount = await getLoserTESTAssetsAmount()
                let loserThings = await getLoserThingsTEST()
                let loserResources = await getLoserResourcesTEST()
                let loserAugment = await getLoserAugmentationsTEST()
                res.render(
                    "./pvp/pvp",
                    {
                        title: "PVP",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        wins,
                        loses,
                        loser: '0xdE7f42bDA25D749127c4694164aB557821A83b96',
                        loserAssetsAmount,
                        things: loserThings,
                        augmentations: loserAugment,
                        resources: loserResources
                    }
                )
            }
        }
        
    )

//write winner data without payoff
router.route("/pvp/write_winner_wo_payoff")
    .post(
        async (req, res) => {
            await writeWinnerWOPayoff(
                req.session.user.address,
                req.body.loser,
                req.body.cardWinner,
                req.body.cardLoser
            )
            res.redirect(
                '/pvp'
            )
        } 
    )

//write winner data with payoff
router.route("/pvp/write_winner_w_payoff")
    .post(
        async (req, res) => {
            await writeWinnerWPayoff(
                req.session.user.address,
                req.body.loser,
                req.body.cardWinner,
                req.body.cardLoser
            )
            res.redirect(
                '/pvp'
            )
        } 
    )

//write loser data
router.route("/pvp/write_loser")
    .post(
        async (req, res) => {
            await writeLoser(
                req.session.user.address,
                req.body.card
            )
            res.redirect(
                '/pvp'
            )
        } 
    )



module.exports = router