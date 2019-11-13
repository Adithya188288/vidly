const express = require("express")
const app = express()
const { logger } = require("./startup/logger")
const config = require("config")

// Registering listeners

process.on("unhandledRejection", err => {
  throw err
})

//Requiring all the startup modules
// require("./startup/logger")()
require("./startup/routes")(app)
require("./startup/db")()
require("./startup/config")()
require("./startup/validation")()

console.log(config.get("environment"))

if (config.get("environment") === "production") {
  require("./startup/prod.js")(app)
}


const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  logger.info(`Server Started in port ${port}.... `)
  logger.log({
    level: "info",
    message: `Server Started in port ${port}.... `
  })
})

module.exports = server
