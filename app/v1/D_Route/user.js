const express = require("express")
const route = express.Router()
const user = require("../C_Controller/user")
const { verifyToken, limiter } = require("../A_Config/auth")

route.post("/firstoken", limiter, user.firstoken).post("/register", limiter,  user.regis).post("/send_otp", limiter, verifyToken, user.sendOtp) 
.post("/upload_berkas",limiter, user.uploadGambar)

module.exports = route
