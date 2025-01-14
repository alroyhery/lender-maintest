const jwt = require("jsonwebtoken")
const rateLimit = require("express-rate-limit")
const crypto = require("crypto")

// Konfigurasi rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5, // Maksimal 10 permintaan per IP dalam 15 menit
    handler: (req, res) => {
        res.status(429).json({
            status: false,
            message: "Terlalu banyak permintaan, coba lagi nanti",
            data: {},
        })
    },
})

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: false,
            message: "Invalid Authorization",
            data: [],
        })
    }

    const token = authHeader.split(" ")[1]
    const privateKey = process.env.SECRET_KEY

    try {
        jwt.verify(token, privateKey)
        next() // Token is valid, proceed to the next middleware
    } catch (error) {
        return res.status(403).json({
            status: false,
            message: "Your token is invalid",
            data: [],
        })
    }
}

async function encryptNip(data) {
    try {
        const cipher = crypto.createCipher("aes-128-cbc", process.env.SECRET_KEY)
        let encrypted = cipher.update(data.nip_potong, "utf8", "hex")
        encrypted += cipher.final("hex")
        return { nip_potong: encrypted }
    } catch (err) {
        console.error("Error encrypting nip_potong:", err)
        throw err // Propagate the error for upstream handling
    }
}

async function encrypt(data) {
    try {
        const cipher = crypto.createCipher("aes-128-cbc", process.env.SECRET_KEY)
        let encrypted = cipher.update(data.sandi, "utf8", "hex")
        encrypted += cipher.final("hex")
        return { sandi: encrypted }
    } catch (err) {
        console.error("Error encrypting sandi:", err)
        throw err // Propagate the error for upstream handling
    }
}

module.exports = {
    verifyToken,
    limiter,
    encryptNip,
    encrypt,
}
