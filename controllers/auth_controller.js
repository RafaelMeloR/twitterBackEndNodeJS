const User = require("../models/user");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { validateEmail } = require("../helper/validate_email");

const signup = async (req, res, next) => {
  try {
    const { name, username, email, password, dob, phone_no, gender } = req.body;
    if (!validateEmail(email)) {
      return next(Error("Email not valid"));
    }
    if (password.length < 6) {
      return next(Error("Password should have a minimum of 6 characters"));
    }
    let getUser = await User.findOne({ username: username.trim() }).exec();
    if (getUser) {
      return next(Error(`${email} with phone no: ${phone_no} already Exists`));
    }
    const hash = await argon2.hash(password);
    const user = new User({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password: hash,
      phone_no: phone_no.trim(),
      profile_image: "",
      dob: new Date(dob),
      gender: gender.trim(),
      confirmation_code: "",
      status: true,
      isEmailVerified: false,
      isPhoneVerified: false,
      google_auth_token: "",
    });
    let result = await user.save();
    if (!result) {
      return next(Error("Cannot create a User"));
    }
    return res.json({ message: "User Created Successfully" });
  } catch (error) {
    return next(Error(error));
  }
};

const login = async (req, res, next) => {
  console.log("auth/sign-in");
  const { username, password } = req.body;
  console.log(username, password);
  let user = await User.findOne({ username: username.trim() }).exec();
  if (!user) {
    return next(Error("User does not exist"));
  }
  if (await argon2.verify(user.password, password)) {
    const token = jwt.sign({ uid: user._id }, process.env.secrete);
    return res.json({
      token: token,
    });
  } else {
    return next(Error("Invalid Credentials"));
  }
};
const getprofile = async (req, res, next) => {
  let user = req.user;
  return res.json({ data: user.data });
};

module.exports = {
  signup,
  login,
  getprofile,
};
