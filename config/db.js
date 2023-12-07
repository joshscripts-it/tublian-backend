const mongoose = require("mongoose");

const connString =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_LOCAL;

const dbConn = async () => {
  try {
    await mongoose.connect(connString);

    console.log("Connection to DB succeeded...");
  } catch (err) {
    console.log("Mongo Error: ", err.message);
  }
};

module.exports = { dbConn };
