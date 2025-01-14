const mysql = require("mysql")
const config = require("./config")
const log_db = require("../E_Log/log_db")
const moment = require("moment")
let connection

function createConnection() {
    return mysql.createConnection(config.database)
}

async function connectDatabase() {
    const date = new Date().toISOString() // Menggunakan format ISO untuk waktu
    connection = createConnection()

    connection.connect((err) => {
        if (err) {
            log_db.log("error", `Database connection error: ${err.message} | Time: ${moment().format("YYYY-MM-DD HH:mm:ss")}`)
            console.error(`Database connection error: ${err.message}`)
        } else {
            log_db.log("info", `Database connection success | Time: ${moment().format("YYYY-MM-DD HH:mm:ss")}`)
            console.log(`Connected to ${config.database.host} -> ${config.database.database}`)
        }
    })

    connection.on("error", (err) => {
        if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
            log_db.log("warn", `Connection lost. Restarting... | Time: ${moment().format("YYYY-MM-DD HH:mm:ss")}`)
            console.warn("Database connection lost. Reconnecting...")
            connectDatabase() // Rekoneksi
        } else {
            log_db.log("error", `Unhandled error: ${err.message}`)
            console.error(`Unhandled database error: ${err.message}`)
        }
    })
}

// Inisialisasi koneksi
connectDatabase()

module.exports = connection
