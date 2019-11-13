const mongoose = require("mongoose")
const Joi = require("@hapi/joi")
const { genreSchema } = require("../models/genres")

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  }
})

const Movies = mongoose.model("Movie", movieSchema)

// Validating a record
// Since Joi has been moved to hapi framework. syntax and code has changed check documentation for more deatils
validateMovie = movie => {
  console.log("Validating Movie....")
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .min(1)
      .max(255),
    genre: Joi.objectId().required(),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(255),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(255)
  })

  return schema.validate(movie)
}

validateId = id => {
  console.log(id)
  const schema = Joi.objectId().required()
  return schema.validate(id)
}

exports.Movies = Movies
exports.validateMovie = validateMovie
exports.validateId = validateId
