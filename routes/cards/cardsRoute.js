const {Router} = require("express")
const router = Router()
const { getUserCards, getMaxAbility } = require("../../service/cards/cardService");
const db = require("../../db/db.js")

router.route("/cards")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect('/')
            } else {
                // let cards = await getUserCards(req.body.cards)
                // console.log(cards)
                res.render(
                    "./cards/cards",
                    {
                        title: "cards",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        // cards
                    }
                )
            }
        }
    )

router.route("/cards/get")
    .post(
        async (req, res) => {
            let userCards = req.body.cards
            // console.log(userCards[0])
            userCards = userCards.split(",")
            console.log(userCards)
            let cards = []
            for (let i = 0; i < userCards.length - 1; i++) {
                let numAbilities = await db.query(getAllCardsNumAbility, [parseInt(userCards[i])]).then(res => {return res.rows})
                let alwaysAbilities = await db.query(cardAlwaysNumAbilities, [parseInt(userCards[i])]).then(res => {return res.rows})
                let boolAbilities = await db.query(cardBoolAbilities, [parseInt(userCards[i])]).then(res => {return res.rows})
                let maxAbility = await getMaxAbility(parseInt(userCards[i]))
                let conservation = await db.query(conservationText, [parseInt(userCards[i])])
                    .then(res => {
                        if (res.rowCount == 0) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                let card = {
                    id: userCards[i],
                    numAbilities,
                    alwaysAbilities,
                    boolAbilities,
                    maxAbility,
                    conservation
                } 
                cards[i] = card
            }
            console.log(cards)
            // res.json(cards)
            res.render(
                "./cards/cards",
                {
                    title: "cards",
                    haveUser: true,
                    userAddress: req.session.user.address,
                    cards
                }
            )
        }
    )


const getAllCardsNumAbility = "SELECT * FROM cardNumAbilities WHERE cardid=$1 ORDER BY id ASC"
const cardAlwaysNumAbilities = "SELECT * FROM cardAlwaysNumAbilities WHERE cardid=$1 ORDER BY id ASC"
const cardBoolAbilities = "SELECT * FROM cardBoolAbilities WHERE cardid=$1 ORDER BY id ASC"
const conservationText = "SELECT * FROM conservation WHERE cardid=$1"

module.exports = router;