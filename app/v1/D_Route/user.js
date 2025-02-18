const express = require("express")
const route = express.Router()
const user = require("../C_Controller/user")
const { verifyToken, limiter } = require("../A_Config/auth")

route.post("/firstoken", limiter, user.firstoken)
route.post("/register", limiter, user.regis)
route.post("/send_otp", limiter, user.sendOtp)
route.post("/send_otp_code", limiter, user.confirmOTP)

route.post("/upload_gambar", limiter, user.uploadGambarBerkas)

// login
route.post("/login", limiter, user.login)

module.exports = route