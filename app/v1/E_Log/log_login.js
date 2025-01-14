const { createLogger, transports, format } = require("winston")
const moment = require("moment")
const fDate = moment().format("YYYY_MM_DD")

const logger = createLogger({
    transports: [
        new transports.File({
            filename: `./Log/login/info_login_${fDate}.log`,
            level: "info",
            format: format.combine(format.timestamp(), format.json()),
        }),
    ],
})

module.exports = logger
