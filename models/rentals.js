const mongoose = require("mongoose")
const Joi = require("@hapi/joi")
const moment = require("moment")


const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
})

//Encasulating the logic within the schema - Information Expert Principle 

//Any logic that calculates the state of the object properties should be encapsulated with the object itself

rentalSchema.methods.returns = function () {

  this.dateReturned = new Date()
  const rentalDays = moment().diff(this.dateOut, 'days')
  this.rentalFee = rentalDays * this.movie.dailyRentalRate
}


rentalSchema.statics.lookup = function (customerID, movieID) {

  return this.findOne({
    'customer._id': customerID,
    'movie._id': movieID
  })

}

const Rentals = mongoose.model("Rental", rentalSchema)

const validateRental = rental => {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  })

  return schema.validate(rental)
}

const validateId = Id => {
  const schema = Joi.objectId().required()
  return schema.validate(Id)
}

exports.validateId = validateId
exports.validateRental = validateRental
exports.Rentals = Rentals
