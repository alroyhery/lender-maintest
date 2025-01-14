const { createLogger, transports, format } = require("winston")
const moment = require("moment")
const fDate = moment().format("YYYY_MM_DD")

const logger = createLogger({
    transports: [
        new transports.File({
            filename: `./Log/database/info_db_${fDate}.log`,
            level: "info",
            format: format.combine(format.timestamp(), format.json()),
        }),
    ],
})

module.exports = logger
