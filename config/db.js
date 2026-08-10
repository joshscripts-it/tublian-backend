const mongoose = require("mongoose");

const connString =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tublian_db";

const dbConn = async () => {
  try {
    await mongoose.connect(connString);

    console.log("Connection to DB succeeded...");
  } catch (err) {
    console.log("Mongo Error: ", err.message);
  }
};

module.exports = { dbConn };
