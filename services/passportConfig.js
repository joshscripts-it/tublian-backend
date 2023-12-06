const passport = require("passport");
const { User } = require("../models/userModel");

//Passport-Jwt config
const JwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const opts = {};

opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

//JWT STRATEGY
const jwtStrategy = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    // console.log(jwt_payload);
    try {
      const user = await User.findById({ _id: jwt_payload.id }).select(
        "-password"
      );
      if (!user) {
        return done(null, false, {
          message: "User doesn't exist",
          statusCode: 404,
        });
      }

      return done(null, user);
    } catch (err) {
      throw err;
    }
  })
);

//serialize and deserialize user
//@desc: makes sure user stay loggedIn while navigating through the app
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  }).select("-password");
});

module.exports = {
  jwtStrategy,
};
