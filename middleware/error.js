const { logger } = require("../startup/logger")

module.exports = function(err, req, res, next) {
  logger.error(err.message, err)

  return res.status(500).send("Something failed...")
}

// const winston = require("winston")

// module.exports = function(err, req, res, next) {
//   winston.loggers.get("logger").error({
//     level: "error",
//     message: err
//   })

//   //Error
//   //Warn
//   //Info
//   //Verbose
//   //Debug
//   //Silly

//   return res.status(500).send("Something failed...")
// }
