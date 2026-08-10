const express = require("express");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");

const { dbConn } = require("./config/db");
const router = require("./router/routes");
const { errorHandler } = require("./middleware/errorMiddleware");
require("./services/passportConfig").jwtStrategy;

const port = process.env.PORT || 5000;
const app = express();

// Trust proxy for sessions behind reverse proxies
app.set("trust proxy", 1);

/*
************************************
            MIDDLEWARES
*************************************
*/
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Fallback MongoDB URI - ensure 127.0.0.1 is used instead of localhost
const mongoUri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI
    : (
        process.env.MONGO_LOCAL || "mongodb://127.0.0.1:27017/tublian_db"
      ).replace("localhost", "127.0.0.1");

// Session middleware using Mongoose's existing connection promise
app.use(
  session({
    store: MongoStore.create({
      clientPromise: dbConn().then(() => mongoose.connection.getClient()),
      ttl: 60 * 60, // 1 hour TTL
    }),
    secret: process.env.JWT_SECRET || "fallback_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60000 * 60, // 1 hour
    },
  }),
);

//@init passport
app.use(passport.initialize());
app.use(passport.session());

//@routes
app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "WELCOME, Joshscript Tublian Challenge Backend Service running!",
    status: 200,
  });
});

app.use("/api", router);

//@error middleware MUST be declared AFTER routes
app.use(errorHandler);

//@DB Conn & Server Start
dbConn()
  .then(() => {
    app.listen(port, () => console.log(`Server started on port: ${port} ...`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
  });
