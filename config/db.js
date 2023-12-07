const { MongoClient, ServerApiVersion } = require("mongodb");

const connString =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : process.env.MONGO_LOCAL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(connString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConn = async () => {
  let conn;

  try {
    //connect to mongodb
    // conn = await mongoose.connect(connString);

    // Connect the client to the server	(optional starting in v4.7)
    conn = await client.connect();

    console.log("Connection to DB succeeded...->", conn.s.url);
  } catch (err) {
    console.log("Mongo Error: ", err.message);
  }
};

module.exports = { dbConn };
