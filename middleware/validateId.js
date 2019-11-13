const mongoose = require("mongoose")
const joi = require("@hapi/joi")

module.exports = function validateId(req, res, next) {
  const schema = joi.objectId()
  let result = schema.validate(req.body.customerID)
  if (result.error) {
    return res.status(400).send("Invalid Customer ID")
  }

  result = schema.validate(req.body.movieID)
  if (result.error) {
    return res.status(400).send("Invalid Movie ID")
  }

  next()
}
