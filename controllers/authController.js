const router = require("express").Router();
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    //1. If the user already exists
    const user = await User.findOne({ email: req.body.email });

    //2. if user exists, send an error response
    if (user) {
      return res.send({
        success: false,
        message: "User already exists.",
      });
    }

    //3. encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    //4. Create new user, save in DB
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User created successfully!",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    //1. Check if user exists
    const user = await User.findOne({ email: req.body.email });

    //2. if user exists, send an error response
    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist",
      });
    }

    //2. check if the password is correct
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).send({
        message: "invalid password",
        success: false,
      });
    }

    //3. If the user exists & password is correct, assign a JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.send({
      message: "user logged-in successfully",
      success: true,
      token: token,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;