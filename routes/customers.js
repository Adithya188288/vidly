const mongoose = require("mongoose") //importing module
const Joi = require("@hapi/joi")
const express = require("express")
const router = express.Router()

// Design Customer Schema

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  phone: { type: String, required: true, minlength: 5, maxlength: 20 }
})

//Creating a csutomer model
const Customers = mongoose.model("Customer", customerSchema) // Customer is a class to interact with the db

//get all customers
router.get("/", async (req, res) => {
  const customers = await Customers.find().sort("name")
  if (customers.length === 0)
    return res.send("There is no customers added yet. Please add a customer")
  return res.send(customers)
})

//get a customer
router.get("/:id", async (req, res) => {
  const customer = await Customers.findById(req.params.id)
  if (!customer)
    return res.status(404).send("The specified resource does not exists")
  return res.send(customer)
})

//Add a customer
router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let newCustomer = new Customers({
    name: req.body.name,
    phone: req.body.phone
  })

  newCustomer = await newCustomer.save()

  return res.send(newCustomer)
})

//update a customer
router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const customer = await Customers.findByIdAndUpdate(
    req.params.id,
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone
    },
    { new: true }
  )

  if (!customer)
    return res.status(404).send("The specified resource does not exists")

  return res.send(customer)
})

//delete a customer
router.delete("/:id", async (req, res) => {
  const customer = await Customers.findByIdAndRemove(req.params.id)
  if (!customer)
    return res.status(404).send("The specified resource does not exists")
  return res.send(customer)
})

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

module.exports = router //exporting the router module
