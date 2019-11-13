const mongoose = require("mongoose")
const Joi = require("@hapi/joi")
const jwt = require("jsonwebtoken")
const config = require("config")

//rental schema
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 55
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

registerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  )
  return token
}

//creating a class from rental schema via mongoose model
const Register = mongoose.model("Register", registerSchema)

//Validating the Register Schema through Joi

const validateRegister = register => {
  const schema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(55)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  })
  return schema.validate(register)
}

//Export the necessary items
module.exports.validateRegister = validateRegister
module.exports.Register = Register
