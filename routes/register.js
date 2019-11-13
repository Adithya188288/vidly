const express = require("express")
const _ = require("lodash")
const bcrypt = require("bcrypt")
const router = express.Router()
const { validateRegister, Register } = require("../models/register")

// Post request
router.post("/", async (req, res) => {
  let newRegister = null

  try {
    const { error } = validateRegister(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //check if the client is already registered
    const userAlreadyExixts = await Register.findOne({ email: req.body.email })
    if (userAlreadyExixts)
      return res
        .status(400)
        .send("Email Account already registered. Try Logging in")

    newUser = _.pick(req.body, ["name", "email", "password"])

    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password, salt)
    //Creating a new user
    newUser = new Register(newUser)

    newUser = await newUser.save()

    //remember to send only the necessary details, sesitive details should not be sent to the client
    const token = newUser.generateAuthToken()
    return res
      .header("x-auth-token", token)
      .send(_.pick(newUser, ["_id", "name", "email"]))
  } catch (e) {
    return res.status(500).send(e.errmsg)
  }
})

module.exports = router
