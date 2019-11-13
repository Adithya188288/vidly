const express = require("express")
const _ = require("lodash")
const bcrypt = require("bcrypt")
const router = express.Router()
const { validateAuth } = require("../models/auth")
const { Register } = require("../models/register")

// Post request
router.post("/", async (req, res) => {
  try {
    const { error } = validateAuth(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //check if the client is already registered
    const user = await Register.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid Email or Password")

    let validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Invalid Email or Password")

    //remember to send only the necessary details, sesitive details should not be sent to the client
    //create a JWT token

    const token = user.generateAuthToken()
    return res.send(token)
  } catch (e) {
    return res.status(500).send(e.errmsg)
  }
})

module.exports = router
