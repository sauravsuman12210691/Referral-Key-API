const express = require('express')
require('dotenv').config()
const UserRoutes = require('./Routes/User')
const referral = require("./Routes/Referral")
const DB = require("./config/db");
const app = express()
DB();
app.use(express.json());
const port = process.env.PORT

app.use("/api/user",UserRoutes)
app.use("/api/referral",referral)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})