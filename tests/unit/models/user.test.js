const { Register } = require("../../../models/register")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const config = require("config")

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    }
    const user = new Register(payload)
    const token = user.generateAuthToken()
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"))
    expect(decoded).toMatchObject(payload)
  })
})