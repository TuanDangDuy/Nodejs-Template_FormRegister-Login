const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    //check email exists or not in DB?
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: "FAILED",
        message: "Email already exists",
      });
    }

    //Validate name
    if (!validator.isAlpha(name)) {
      res.status(400).json({
        status: "FAILED",
        message: "Name must only contain alphabetic characters",
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid email address",
      });
    }

    // Validate password length
    if (!validator.isLength(password, { min: 8 })) {
      res.status(400).json({
        status: "FAILED",
        message: "Password must be at least 8 characters long",
      });
    }

    // Validate password strength (optional)
    if (!validator.isStrongPassword(password)) {
      res.status(400).json({
        status: "FAILED",
        message: "Password is not strong enough",
      });
    }

    // Check if confirmPassword matches password
    if (password !== confirmPassword) {
      res.status(400).json({
        status: "FAILED",
        message: "Password and confirmPassword do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const isMatchConfirmPassword = await bcrypt.compare(
    //   confirmPassword,
    //   hashedPassword
    // );

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      confirmPassword,
    });

    const user = await newUser.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "User created successfully",
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: "Failed to create user",
      error: err.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if username and password is provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      });
    }

    const user = await User.findOne({ email });
    if(!user) {
      res.status(401).json({
        status: 'FAILED',
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      res.status(200).json({
        status: 'SUCCESS',
        message: "Login successful",
        user,
      })
    }
  } catch (error) {
    res.status(400).json({
      status: 'FAILED',
      message: "An error occurred",
      error: error.message,
    });
  }
});

module.exports = router;
