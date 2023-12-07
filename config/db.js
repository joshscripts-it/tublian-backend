const mongoose = require("mongoose");

const connString =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_LOCAL;

const dbConn = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    await mongoose.connect(connString);

    console.log("Connection to DB succeeded...");
  } catch (err) {
    console.log("Mongo Error: ", err.message);
  }
};

module.exports = { dbConn };
