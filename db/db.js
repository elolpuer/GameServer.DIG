const {Client} = require("pg")
const client = new Client({
    user: "egorg",
    password: "password",
    host: "localhost",
    database: "cardgame",
    port: 5432
})
client
  .connect()
  .then(() => console.log('DB has been connected'))
  .catch(err => console.error('connection error', err.stack))

module.exports = client