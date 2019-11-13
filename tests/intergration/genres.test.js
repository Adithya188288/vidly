const request = require("supertest")
const { Genres } = require("../../models/genres")
const { Register } = require("../../models/register")
const mongoose = require("mongoose")
let server

//creating a TEST SUITE for genres api
describe("api/genres", () => {
  // An error will be thrown if we do not initialize server in and close it for each test.
  //  As the port 3000 will already be in use once the server starts, an server will be thrown
  beforeEach(() => {
    server = require("../../index")
  })

  afterEach(async () => {
    //deleting all the items in the test db after each test case
    await Genres.remove({})
    server.close()
  })

  //Grouping all the endpoint under /genre/api/ under this test suite

  describe("GET /", () => {
    it("Should return all the genres", async () => {
      //populating the db with test data
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ])

      const res = await request(server).get("/api/genres")
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy()
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy()
    })
  })

  describe("GET /:id", () => {
    it("Should return a genre with a id", async () => {
      const genre = new Genres({ name: "Thriller" })
      await genre.save()

      const res = await request(server).get("/api/genres/" + genre._id)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("name", genre.name)
    })

    it("Should return 404 if an invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1")
      expect(res.status).toBe(404)
    })
  })

  describe("POST/", () => {
    let token
    let name

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name })
    }

    beforeEach(() => {
      token = new Register().generateAuthToken()
      name = "genre1"
    })

    it("Should return a 401 error if the user is not authorised", async () => {
      token = ""

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it("Should return status code 400 invalid if Genre is less than 5", async () => {
      name = "gen"

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it("Should Return status code 400 invalid if the Genre is greater than 50", async () => {
      name = new Array(52).join("a")

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it("Should Save a valid genre ", async () => {
      await exec()

      const genre = Genres.find({ name: "genre1" })

      expect(genre).not.toBeNull()
    })

    it("Should return a valid genre ", async () => {
      const res = await exec()
      expect(res.body).toHaveProperty("_id")
      expect(res.body).toHaveProperty("name", "genre1")
    })
  })

  describe("PUT/:id", () => {
    let _id
    let name
    let token

    beforeEach(() => {
      _id = mongoose.Types.ObjectId()
      name = "genre1"
      token = new Register().generateAuthToken()
    })
    //Happy Path
    const exec = () => {
      return request(server)
        .put("/api/genres/" + _id)
        .set("x-auth-token", token)
        .send({ name: name })
    }

    it("should return 404 if a valid id is not provided", async () => {
      _id = "123"

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it("should return 400 if genre is less than 5 character", async () => {
      name = "thi"

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it("should return 400 if genre is more than 50 character", async () => {
      name = new Array(52).join("a")

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it("should return 404 if the given genre id is valid but dosent exists in db", async () => {
      const res = await exec()

      expect(res.status).toBe(404)
    })

    it("should return 200 and the updated genre value", async () => {
      const genre = new Genres({ name: "movie1" })
      await genre.save()

      _id = genre._id

      const res = await exec()

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("_id")
      expect(res.body).toHaveProperty("name", "genre1")
    })
  })

  describe("DELETE/:id", () => {
    //define the happy path
    let token
    let genre
    let id

    beforeEach(async () => {
      genre = new Genres({ name: "genre1" })
      await genre.save()

      id = genre._id
      token = new Register({ isAdmin: true }).generateAuthToken()
    })

    const exec = () => {
      return request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send()
    }

    it("should return 401 if client is not logged in", async () => {
      token = ""

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it("should return 403 Access Denied if the client is not authorised", async () => {
      token = new Register({ isAdmin: false }).generateAuthToken()

      const res = await exec()

      expect(res.status).toBe(403)
    })

    it("should return 400 if invalid Id is passed", async () => {
      id = "1"

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it("should return 404 if genre id dosent exist In the db", async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it("should return 200 and the deleted Genres", async () => {
      const res = await exec()

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("_id", genre._id.toHexString())
      expect(res.body).toHaveProperty("name", "genre1")
    })
  })
})
