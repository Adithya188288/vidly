const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const isAdmin = require("../middleware/isAdmin")
const validateId = require("../middleware/validateId")
const { Rentals } = require("../models/rentals")
const { Movies } = require("../models/movies")

router.post("/", [auth, validateId], async (req, res) => {


  const rental = await Rentals.lookup(req.body.customerID, req.body.movieID)

  if (!rental) return res.status(404).send("The Rental Id does not exists")

  if (rental.dateReturned) return res.status(400).send("This rental has already been processed")

  rental.returns();
  await rental.save()

  await Movies.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  })


  res.status(200).send(rental)

})

module.exports = router
