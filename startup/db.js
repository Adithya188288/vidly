const mongoose = require("mongoose") //Easy to use API to interact with mongoDb
const config = require("config")

//Db connection
module.exports = function() {
  const db = config.get("db")
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => console.log(`Connected To MongoDb ${db}`))
    .catch(err => console.error(`Could not connect to MongoDB... ${db}`))
}
