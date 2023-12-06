const { hashSync, compareSync, genSaltSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

//log user in
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "First and Last Name is marked required",
      statusCode: 400,
    });
  }

  try {
    //@find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ statusCode: 4040, msg: "User Not Found" });
    }

    //@user found, validate passwd
    const passwdMatch = compareSync(password, user.password);

    if (!passwdMatch) {
      //@
      return res
        .status(401)
        .json({ statusCode: 401, msg: "Password do not match" });
    }

    const token = genToken(user._id);

    const matchedUser = {
      id: user.id,
      token,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res
      .status(200)
      .json({ msg: "Login successful", statusCode: 200, user: matchedUser });
  } catch (err) {
    throw err;
  }

  next();
};

//create account
const register = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      msg: "Email and Password field is marked required",
    });
  }

  try {
    //@check if user already register
    const isUserRegistered = await User.findOne({ email: email });

    if (isUserRegistered) {
      return res
        .status(400)
        .json({ msg: "User already registered.", statusCode: 400 });
    }

    //@hash password
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    //@register new user
    const newUser = await User.create({ email, password: hash });

    if (!newUser) {
      //@something went wrong: user was not created
      return res
        .status(500)
        .json({ statusCode: 500, msg: "Something went wrong" });
    }

    const user = {
      _id: newUser.id,
      email: newUser.email,
      createtedAt: newUser.createdAt,
      updateAt: newUser.updatedAt,
    };

    res.status(200).json({ statusCode: 200, user });
  } catch (err) {
    throw err;
  }
};

//gen auth token
const genToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  return token;
};

module.exports = { register, login };
