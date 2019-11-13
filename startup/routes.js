require("express-async-errors")
const morgan = require("morgan")
const express = require("express")
const genres = require("../routes/genres")
const customers = require("../routes/customers")
const movies = require("../routes/movies")
const rentals = require("../routes/rentals")
const register = require("../routes/register")
const auth = require("../routes/auth")
const returns = require("../routes/returns")

const error = require("../middleware/error")

module.exports = function (app) {
  //All middlewares
  //accepts incoming request with json payloads
  app.use(express.json())
  //accepts incoming request with of form containing json payloads
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static("./public")) // any document under public accesible when the server starts
  app.get("env") === "development" && app.use(morgan("tiny")) // al
  app.use("/api/genres", genres)
  app.use("/api/customers", customers)
  app.use("/api/movies", movies)
  app.use("/api/rentals", rentals)
  app.use("/api/register", register)
  app.use("/api/auth", auth)
  app.use("/api/returns", returns)

  app.use(error)
}
