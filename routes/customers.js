const express = require("express")
const router = express.Router()
const { Customers, validateCustomer } = require("../models/customers")
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

module.exports = router //exporting the router module
