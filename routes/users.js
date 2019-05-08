const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/User");

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...req.body,
      password: hashPassword
    });

    await user.save();

    const payload = {
      username
    };
    const token = await jwt.sign(payload, req.app.get("API_JWT_KEY"), {
      expiresIn: 720 // 12 HOURS
    });

    res.json({
      status: true,
      token
    });
  } catch (error) {
    res.json(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const isExistUser = await User.findOne({ username });

    if (!isExistUser) {
      res.json({
        status: false,
        message: "User not found!!"
      });
    } else {
      const compare = await bcrypt.compare(password, isExistUser.password);

      if (!compare) {
        res.json({
          status: false,
          message: "Password is wrong. Please try again!!"
        });
      } else {
        const payload = {
          username
        };
        const token = await jwt.sign(payload, req.app.get("API_JWT_KEY"), {
          expiresIn: 720 // 12 HOURS
        });

        res.json({
          status: true,
          token
        });
      }
    }
  } catch (error) {
    throw error;
  }
});

module.exports = router;
