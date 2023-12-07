const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const passport = require("passport");
const router = require("./router/router");
require("./services/passportConfig").jwtStrategy;
const { dbConn } = require("./config/db");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const { errorHandler } = require("./middleware/errorMiddleware");

//@init app
const app = express();

//-prevent momery unleaked---------
app.set("trust proxy", 1);

/*
************************************

            MIDDLEWARES

*************************************
*/
//@allow same origin resource
app.use(require("cors")());

//json parser
app.use(express.json({ limit: "10mb" }));
app.use(
  session({
    store: new mongoStore({
      mongoUrl:
        process.env.NODE_ENV === "production"
          ? process.env.MONGO_URI
          : process.env.MONGO_LOCAL,
    }),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 },
  })
);

//@init passport
app.use(passport.initialize());
app.use(passport.session());

//@route
app.get("/", (req, res, next) => {
  res.status(200).json({
    msg: "Welcome! Joshag Tublian Challenge Server Section.",
    status: 200,
  });
});

//@error middleware
app.use(errorHandler);
app.use("/api", router);

//connect Db
dbConn();

app.listen(port, () => console.log("Server started on port: ", port, "..."));
