const { Register } = require("../../../models/register")
const auth = require("../../../middleware/auth")
const mongoose = require("mongoose")

describe("Testing Auth Middleware", () => {
  it("should return the valid payload after the JWT is decoded", () => {
    const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
    const token = new Register(user).generateAuthToken()
    const req = {
      header: jest.fn().mockReturnValue(token)
    }
    const res = {}
    const next = jest.fn()

    auth(req, res, next)

    expect(req.user).toMatchObject(user)
  })
})
