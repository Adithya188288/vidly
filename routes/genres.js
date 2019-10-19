const express = require("express")
const router = express.Router()
const Joi = require("@hapi/joi")

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Drama" },
  { id: 3, name: "Adventure" }
]

//GET request

router.get("/", (req, res) => {
  res.send(genres)
})

// Get request - indivudual

router.get("/:id", (req, res) => {
  //check if the value exists
  const genre = genres.find(g => g.id === Number(req.params.id))
  if (!genres)
    return res.status(404).send("The requested resource does not available")

  return res.send(genre)
})

//Post request

router.post("/", (req, res) => {
  const { error, value } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const newGenre = {
    id: genres.length + 1,
    name: value.name
  }

  genres.push(newGenre)
  return res.send(newGenre) // always send the new added obj
})

//Updating a record

router.put("/:id", (req, res) => {
  //check if the value exists
  const genre = genres.find(g => g.id === Number(req.params.id))
  if (!genre)
    return res.status(404).send("The requested resource does not available")

  const { error, value } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  genre.name = value.name //updates the value

  return res.send(genre) //send the updated value
})

//Delete request
router.delete("/:id", (req, res) => {
  //check if the value exists
  const genre = genres.find(g => g.id === Number(req.params.id))
  if (!genre)
    return res.status(404).send("The requested resource does not available")

  const index = genres.indexOf(genre)
  genres.splice(index, 1)

  return res.send(genre) // return the deleted obj
})

// Validating a record
// Since Joi has been moved to hapi framework. syntax and code has changed check documentation for more deatils
validateGenre = genre => {
  const schema = Joi.object({
    name: Joi.string().required()
  })

  return schema.validate(genre)
}

module.exports = router
