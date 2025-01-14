const express = require("express")
const route = express.Router()

const user = require("../v1/D_Route/user")

route.use("/api/user", user)

module.exports = route
