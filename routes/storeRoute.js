const config = require('config');
const {Router} = require('express');
const web3 = require("web3")

const router = Router();

const {
    buyAugmentations, buyThings, buyResources
} = require("../service/store/storeService.js")

const augmentAmount = config.get("augmentAmount")
const price = "0.01 "

//get store page
router.route("/store")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                res.render(
                    "./store/store",
                    {
                        title: "Store",
                        haveUser: true,
                        userAddress: req.session.user.address,
                    }
                )
            }
        }
    )

//get augmentation store page
router.route("/store/augmentations")
    .get(
        (req, res) => {
            if(req.session.user == null) {
                res.redirect("/")
            } else {
                //create array of augment names 
                let augmentations = [
                    {name: "telekinetics"},
                    {name: "ichthyo"},
                    {name: "ornio"},
                    {name: "hacker"},
                    {name: "shair"},
                    {name: "impulse"},
                    {name: "meteodron"},
                    {name: "vibroImpact"},
                    {name: "holdIncrease"}
                ]
                res.render(
                    "./store/storeAugment",
                    {
                        title: "Store Augment",
                        haveUser: true,
                        userAddress: req.session.user.address,
                        augmentations,
                        price: `${price} DBT`
                    }
                )
            }
        }
    )

//buy augment
router.route("/store/augmentations/buy")
        .post(
            async (req, res) => {
                //gets amount of each augment
                let augment = [
                    req.body.telekinetics,
                    req.body.ichthyo,
                    req.body.ornio,
                    req.body.hacker,
                    req.body.shair,
                    req.body.impulse,
                    req.body.meteodron,
                    req.body.vibroImpact,
                    req.body.holdIncrease
                ]
                //buy function
                await buyAugmentations(
                    augment, 
                    req.session.user.address
                )
                res.redirect("/session")
            }
        )

router.route("/store/things")
        .get(
            (req, res) => {
                if(req.session.user == null) {
                    res.redirect("/")
                } else {
                    //create things name array
                    let things = [
                        {name: "note"},
                        {name: "booster"},
                        {name: "snare"},
                        {name: "trap"},
                        {name: "bait"}
                    ]
                    res.render(
                        "./store/storeThings",
                        {
                            title: "Store Things",
                            haveUser: true,
                            userAddress: req.session.user.address,
                            things,
                            price: `${price} DBT`
                        }
                    )
                }
            }
        )
router.route("/store/things/buy")
            .post(
                async (req, res) => {
                    let things = [
                        req.body.note,
                        req.body.booster,
                        req.body.snare,
                        req.body.trap,
                        req.body.bait
                    ]
                    await buyThings(
                        things, 
                        req.session.user.address
                    )
                    res.redirect("/session")
                }
            )

router.route("/store/resources")
            .get(
                (req, res) => {
                    if(req.session.user == null) {
                        res.redirect("/")
                    } else {
                        let resources = [
                            {name: "lymph"},
                            {name: "ash"},
                            {name: "flowerum"},
                            {name: "electron"}
                        ]
                        res.render(
                            "./store/storeResources",
                            {
                                title: "Store Resources",
                                haveUser: true,
                                userAddress: req.session.user.address,
                                resources,
                                price: `${price} DBT`
                            }
                        )
                    }
                }
            )
            
router.route("/store/resources/buy")
            .post(
                async (req, res) => {
                    let resources = [
                        req.body.lymph,
                        req.body.ash,
                        req.body.flowerum,
                        req.body.electron
                    ]
                    await buyResources(
                        resources, 
                        req.session.user.address
                    )
                    res.redirect("/session")
                }
            )

module.exports = router