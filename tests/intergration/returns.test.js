//Should return 401 if the user is not logged in
//Should return 403 if the user is not admin
//Should return 400 if the customerID is Invalid
//Should return 400 if the MovieID is Invalid
//Should return 404 if the RentalID does not exixts
//Should return 200 if it is a valid request
//Set the return date
//Increase the Stock
//Calculate the Rental Fee
//Return the rental summary to the client
//Should return 400 if the Rental is already processed

const request = require("supertest");
const { Rentals } = require("../../models/rentals");
const { Register } = require("../../models/register");
const { Movies } = require("../../models/movies");
const mongoose = require("mongoose");
const moment = require("moment")



describe("/api/returns", () => {

  let server;
  let customerID;
  let movieID;
  let rental;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerID, movieID });
  };

  beforeEach(async () => {
    server = require("../../index");
    customerID = mongoose.Types.ObjectId();
    movieID = mongoose.Types.ObjectId();
    token = new Register().generateAuthToken();



    movie = new Movies({
      _id: movieID,
      genre: {
        name: "12345"
      },
      dailyRentalRate: 2,
      title: 'abcde',
      numberInStock: 10
    })
    await movie.save()


    rental = new Rentals({
      customer: {
        _id: customerID,
        name: "abcde",
        phone: "abcde"
      },
      movie: {
        _id: movieID,
        title: "abcde",
        dailyRentalRate: 2
      }
    });
    await rental.save()
  });

  afterEach(async () => {
    await Rentals.remove({});
    server.close();
  });

  it("it should return 401 if the client is not logged in", async () => {
    token = ""

    const res = await exec()

    expect(res.status).toBe(401)
  })
  it("it should return 400 if customer ID is not provided", async () => {
    customerID = ""

    const res = await exec()

    expect(res.status).toBe(400)
  })
  it("it should return 400 if Movie ID is not provided", async () => {
    movieID = ""

    const res = await exec()

    expect(res.status).toBe(400)
  })
  it("it should return 404 if Rental is not provided", async () => {
    await Rentals.remove({})

    const res = await exec()

    expect(res.status).toBe(404)
  })

  it("it should return 200 if Rental is provided", async () => {
    const res = await exec()

    expect(res.status).toBe(200)

  })

  it("it should return 400 if the Rental is already processed", async () => {
    rental.dateReturned = new Date()
    await rental.save()

    const res = await exec()

    expect(res.status).toBe(400)
  })

  it("it should set the return date if it is a valid request", async () => {
    const res = await exec()

    let rentalInDb = await Rentals.findById(rental._id)
    const diff = new Date() - rentalInDb.dateReturned

    expect(diff).toBeLessThan(10 * 1000)

  })

  it("it should set the rental Fee if  it is a valid request", async () => {
    rental.dateOut = moment().add('-7', "days").toDate()

    await rental.save()

    const res = await exec()

    let rentalInDb = await Rentals.findById(rental._id)

    expect(rentalInDb.rentalFee).toBe(14)

  })

  it("it should increment the movie stock if the it is a valid request", async () => {

    await exec()

    let movieInDb = await Movies.findById(movieID)

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)

  })

  it("it should return the rental if the it is a valid request", async () => {

    const res = await exec()

    // let rentalInDb = await Rentals.findById(rental._id)

    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']))
  })


});
