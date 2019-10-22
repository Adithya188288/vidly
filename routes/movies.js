const express = require("express")
const router = express.Router()
const { Genres } = require("../models/genres")
const { Movies, validateMovie } = require("../models/movies")

//Get All Movies
router.get("/", async (req, res) => {
  const movies = await Movies.find({}).sort("-name")
  if (movies.length === 0) return res.send("No Movies found")
  return res.send(movies)
})

//Get a Movie

router.get("/:id", async (req, res) => {
  const movie = await Movies.findById(req.params.id)
  if (!movie) return res.status(404).send("No Movie with the provided Id found")

  return res.send(movie)
})

//Add a movie
router.post("/", async (req, res) => {
  console.log(req.body)
  let newMovie = null
  try {
    //Validating the movie
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Checking if valid genre object exits in Db
    const genre = await Genres.findById(req.body.genre)
    if (!genre) return res.status(404).send("Invalid Genre")

    //Constructing a new Movie Obj
    newMovie = new Movies({
      title: req.body.title,
      genre: new Genres({
        _id: genre._id,
        name: genre.name
      }),
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    })

    newMovie = await newMovie.save()
  } catch (error) {
    return res.send(error.errors)
  }
  // console.log(newMovie)
  return res.status(200).send(newMovie)
})

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genres.findById(req.body.genre)
  if (!genre) return res.status(404).send("Invalid Genre Id")

  const movie = await Movies.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  )

  if (!movie) return res.status(404).send("Invalid Movie Id")

  res.send(movie)
})

//Delete a Movie
router.delete("/:id", async (req, res) => {
  const movie = await Movies.findByIdAndRemove(req.params.id)
  if (!movie) return res.status(404).send("Invalid Movie Id ")
  return res.send(movie)
})

module.exports = router

//Try Catch Block needs to added to handle all Runtime Errors
