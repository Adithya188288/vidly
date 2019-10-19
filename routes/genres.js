const express = require("express")
const router = express.Router()
const { validateGenre, Genres } = require("../models/genres")

//GET request
router.get("/", async (req, res) => {
  const genres = await Genres.find()
  res.send(genres)
})

// Get request - indivudual

router.get("/:id", async (req, res) => {
  //check if the value exists
  console.log(req.params.id)
  const genre = await Genres.findById(req.params.id)
  if (!genre) {
    return res.status(404).send("The requested resource is not available")
  }
  return res.send(genre)
})

//Post request

router.post("/", async (req, res) => {
  const { error, value } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let newGenre = new Genres({ name: req.body.name })
  newGenre = await newGenre.save()
  return res.send(newGenre) // always send the new added obj
})

//Updating a record

router.put("/:id", async (req, res) => {
  const { error, value } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //check if the value exists
  const genre = await Genres.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  )
  if (!genre)
    return res.status(404).send("The requested resource is not available")

  return res.send(genre) //send the updated value
})

//Delete request
router.delete("/:id", async (req, res) => {
  //check if the value exists
  const genre = await Genres.findByIdAndRemove(req.params.id)
  if (!genre)
    return res.status(404).send("The requested resource is not available")

  return res.send(genre) // return the deleted obj
})

module.exports = router
