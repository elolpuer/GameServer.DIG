const {Router} = require('express');
const router = Router();

const {
    getAugmentations,
    decreaseAugmentation
} = require("../service/session/augmentService.js")

const {
    getThings, decreaseThing
} = require("../service/session/thingsService.js")

const {
    getResources, decreaseResource
} = require("../service/session/resourcesService.js")

//get session page
router.route("/session")
    .get(
        async (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                let augmentations = await getAugmentations(
                    req.session.user.address
                )
                let things = await getThings(
                    req.session.user.address
                )
                let resources = await getResources(
                    req.session.user.address
                )
                res.render(
                    "game",
                    {
                        title: "Game",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        augmentations,
                        things,
                        resources
                    }
                )
            }
        }
    )

//decrease augmentation
router.route("/session/decrease_a")
    .post(
        async (req, res) => {
            await decreaseAugmentation(req.body.id, req.session.user.address)
            res.redirect("/session")
        }
    )

//decrease resource
router.route("/session/decrease_r")
    .post(
        async (req, res) => {
            await decreaseResource(req.body.id, req.session.user.address)
            res.redirect("/session")
        }
    )

//decrease thing
router.route("/session/decrease_t")
    .post(
        async (req, res) => {
            await decreaseThing(req.body.id, req.session.user.address)
            res.redirect("/session")
        }
    )

module.exports = router;