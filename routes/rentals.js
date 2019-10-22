const express = require("express")
const router = express.Router()
const { validateRental, Rentals } = require("../models/rentals")
const { Customers } = require("../models/customers")
const { Movies } = require("../models/movies")

//get all rental
router.get("/", async (req, res) => {
  const rentals = await Rentals.find({}).sort("-dateOut")
  if (rentals.length === 0) return res.send("No rental found")

  return res.send(rentals)
})

// Get A Rental

router.get("/:id", async (req, res) => {
  const rental = await Rentals.findById(req.params.id)
  if (!rental) return res.status(404).send("Invalid Rental Id")

  return res.send(rental)
})

//Add a Rental
router.post("/", async (req, res) => {
  //Validating if the req.body coming from the client is valid
  let newRental = null
  try {
    const { error } = validateRental(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customers.findById(req.body.customerId)
    if (!customer) return res.status(400).send("Invalid Customer ID")

    const movie = await Movies.findById(req.body.movieId)
    if (!movie) return res.status(400).send("Invalid movie ID")

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock.")

    newRental = new Rentals({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    })

    newRental = await newRental.save()

    movie.numberInStock--
    movie.save()

    return res.send(newRental)
  } catch (error) {
    return res.status(404).send(error.message)
  }
})

//No need put and delete request because once the user has rented, it cannot be updated or deleted

module.exports = router
