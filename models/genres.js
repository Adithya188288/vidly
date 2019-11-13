const mongoose = require("mongoose")
const Joi = require("@hapi/joi")

//Create a mogoose scheme
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 }
})

//Create a mongoose model
//Returns a Class which we can use to transact with the Db
const Genres = mongoose.model("Genre", genreSchema)

// Validating a record
// Since Joi has been moved to hapi framework. syntax and code has changed check documentation for more deatils
validateGenre = genre => {
  console.log("Validating Genre....")
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(5)
      .max(50)
  })

  return schema.validate(genre)
}

const validateId = id => {
  const schema = Joi.objectId().required()
  return schema.validate(id)
}

exports.validateId = validateId
exports.validateGenre = validateGenre
exports.Genres = Genres
exports.genreSchema = genreSchema
