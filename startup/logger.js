const winston = require("winston")
const { combine, timestamp, label, prettyPrint, errors } = winston.format

const logger = winston.createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }),
    label({ label: "vidly" }),
    prettyPrint(),
    timestamp(),
    // winston.format.simple()
    winston.format.printf(
      info =>
        `${info.timestamp} - ${info.label} - ${info.level}: ${info.message} -  ${info.stack}`
    )
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ filename: "combined.log" })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" })
  ]
})

module.exports.logger = logger
