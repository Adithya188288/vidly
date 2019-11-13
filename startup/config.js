const config = require("config") // used for storing configuration files and environment variables
const { logger } = require("./logger")

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    // // logger.info("JWT TOKEN not defined")
    // logger.log({
    //   level: "error",
    //   message: "JWT TOKEN not defined"
    // })
    logger.error("JWT TOKEN not defined")
    throw new Error("JWT TOKEN not defined")
  }
}
