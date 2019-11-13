const Joi = require("@hapi/joi")

//No model present to autheticate the user. But we need to validate the request body sent from the user.
//  So validation method exist
const validateAuth = auth => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  })
  return schema.validate(auth)
}

//Export the necessary items
module.exports.validateAuth = validateAuth
