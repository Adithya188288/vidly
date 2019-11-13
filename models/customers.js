const mongoose = require("mongoose") //importing module
const Joi = require("@hapi/joi")

// Design Customer Schema

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  phone: { type: String, required: true, minlength: 5, maxlength: 20 }
})

//Creating a csutomer model
const Customers = mongoose.model("Customer", customerSchema) // Customer is a class to interact with the db

const validateCustomer = customer => {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(5)
      .max(30)
      .required()
  })

  return schema.validate(customer)
}

const validateId = id => {
  const schema = Joi.objectId().required()
  return schema.validate(id)
}

exports.validateCustomer = validateCustomer
exports.validateId = validateId
exports.Customers = Customers
