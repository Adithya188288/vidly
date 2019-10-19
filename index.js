const express = require("express")
const Joi = require("@hapi/joi")
const genres = require("./routes/genres")
const morgan = require("morgan")
const helmet = require("helmet")

const app = express()

//All middlewares
app.use(helmet())
//accepts incoming request with json payloads
app.use(express.json())
//accepts incoming request with of form containing json payloads
app.use(express.urlencoded())
app.use(express.static("./public")) // any document under public accesible when the server starts
app.get("env") === "development" && app.use(morgan("tiny")) // al
app.use("/api/genres", genres)
console.log(process.env)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server started at ${port}`))
