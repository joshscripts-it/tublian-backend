const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
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
      if (!jwt_payload) {
        return done(null, false, { msg: "Unauthorized", statusCode: 401 });
      }

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

//@use google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/redirect",
    } /**config obj for google strat. */,
    async (accessToken, refreshToken, profile, done) => {
      //passport-google callback func
      console.log(profile.emails[0].value);
      try {
        const user = await User.create({
          googleId: profile?.id,
          email: profile?.emails[0].value,
        });

        done(null, user);
      } catch (err) {
        done(null, false, { statusCode: 500, msg: err.message });
      }
    }
  )
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
