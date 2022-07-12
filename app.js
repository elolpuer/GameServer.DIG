const express = require('express');
const app = express();
const session = require('express-session')
const sessionRouter = require("./routes/sessionRoute.js")
const authRouter = require("./routes/authRoute.js")
const userRouter = require("./routes/userRoute.js")
const psychoRouter = require("./routes/psycho/psychoRoute.js")
const assetsRouter = require("./routes/assets/assetsRoute.js")
const storeRouter = require("./routes/storeRoute.js")
const sendContract = require("./routes/sendContract.js")
const laboratoryRoute = require("./routes/laboratory/laboratoryRoute.js")
const combiningRoute = require("./routes/laboratory/combiningRoute.js")
const feedingRoute = require("./routes/laboratory/feedingRoute.js")
const conservationRoute = require("./routes/laboratory/conservationRoute.js")
const marketRoute = require("./routes/market/marketRoute.js")
const marketAssetRoute = require("./routes/market/assetsMarketRoute.js")
const marketPsychoRoute = require("./routes/market/psychoMarketRoute.js")
const cardsRoute = require("./routes/cards/cardsRoute.js")
const indexRoute = require("./routes/indexRoute.js")
const rentRoute = require("./routes/rent/rentRoute.js")
const pvpRoute = require("./routes/pvp/pvpRoute.js")
const zeroGenRoute = require("./routes/laboratory/combining/zeroGen.js")
const firstGenRoute = require("./routes/laboratory/combining/firstGen.js")
const secondGenRoute = require("./routes/laboratory/combining/secondGen.js")
const newGenRoute = require("./routes/laboratory/combining/newGen.js")
const lostGenRoute = require("./routes/laboratory/combining/lostGen.js")
const thirdGenRoute = require("./routes/laboratory/combining/thirdGen.js")

const exphbs = require("express-handlebars")
const path = require('path')
const config = require('config')
const PORT = config.get("port");
require('dotenv').config()
const password = process.env.password

const basicAuth = require('basic-auth');

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs"
})


// Ensure this is before any other middleware or routes
// app.use((req, res, next) => {
//     let user = basicAuth(req)
//
//     if (user === undefined || user['name'] !== 'admin' || user['pass'] !== password) {
//       res.statusCode = 401
//       res.setHeader('WWW-Authenticate', 'Basic realm="Node"')
//       res.end('Unauthorized')
//     } else {
//       next()
//     }
//   })

app.use(session({
    // name: 'egor',
    saveUninitialized:false,
    resave: true,
    secret: 'tss...it is a secret',
    // cookie:{
    //     maxAge: 1000 * 60 * 60,
    //     sameSite: true,
    //     secure: false
    // }
}))

app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views", "views")

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))

app.use(indexRoute)
app.use(sessionRouter)
app.use(authRouter)
app.use(userRouter)
app.use(psychoRouter)
app.use(assetsRouter)
app.use(storeRouter)
app.use(sendContract)
app.use(laboratoryRoute)
app.use(feedingRoute)
app.use(conservationRoute)
app.use(combiningRoute)
app.use(marketAssetRoute)
app.use(marketRoute)
app.use(marketPsychoRoute)
app.use(rentRoute)
app.use(cardsRoute)
app.use(pvpRoute)
app.use(zeroGenRoute)
app.use(firstGenRoute)
app.use(secondGenRoute)
app.use(newGenRoute)
app.use(lostGenRoute)
app.use(thirdGenRoute)

app.get('/', (req, res)=> {

    // htpasswd.authenticate({
    //     file: __dirname + '/.htpasswd'
    // })
	// .then((result) => {
    //     console.log(result)
		res.render(
            "index",
            {
                title: "Index",
                haveUser: req.session.user == null ? false : true,
                userAddress: req.session.user == null ? '' : req.session.user.address,
            }
        )
	// });

});

async function start() {
    try {
        app.listen(PORT, (req, res) =>
            console.log(`Server has been started on port ${PORT}...`)
        )
    } catch (error) {
        console.error(error)
    }
}

start()
