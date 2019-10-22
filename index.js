const express = require("express")
const genres = require("./routes/genres")
const customers = require("./routes/customers")
const movies = require("./routes/movies")
const rentals = require("./routes/rentals")
const morgan = require("morgan")
const helmet = require("helmet")
const mongoose = require("mongoose") //Easy to use API to interact with mongoDb

const app = express()

//Db connection
mongoose
  .connect("mongodb://localhost/vidly")
  .then(res => console.log("Connected To MongoDb"))
  .catch(err => console.error("Error", err))

//All middlewares
app.use(helmet())
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
// console.log(process.env)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server started at ${port}`))
