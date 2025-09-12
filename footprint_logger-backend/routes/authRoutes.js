const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dotenv = require("dotenv");
const { User } = require("../models/database.js");
const { authMessages } = require("../utils/helper_objects.js");
const {
  registrationValidation,
  loginValidation,
} = require("../utils/helper_functions.js");
const { validationResult } = require("express-validator");
const { authLogger } = require("../footprint_loggger.js");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", registrationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      authLogger.error("Validation errors during registration", errors.array());
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const existingUser = await User.findByEmail(req.body.email);

    if (existingUser) {
      authLogger.error(authMessages.emailIdExists);
      return res.status(400).json({ error: authMessages.emailIdExists });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username || req.body.firstName,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
    });

    const savedUser = await newUser.save();

    const payload = {
      user: {
        id: savedUser._id,
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    authLogger.info(authMessages.resistrationSuccess);
    res.json({ authtoken, email: req.body.email });
  } catch (e) {
    authLogger.error(e);
    return res.status(500).json({ error: authMessages.internalServerError });
  }
});

router.post("/login", loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      authLogger.error("Validation errors during login", errors.array());
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const theUser = await User.findByEmail(req.body.email);

    if (theUser) {
      let result = await bcryptjs.compare(req.body.password, theUser.password);
      if (!result) {
        authLogger.error(authMessages.passMismatch);
        return res.status(400).json({ error: authMessages.passMismatch });
      }
      let payload = {
        user: {
          id: theUser._id.toString(),
        },
      };

      const userName = theUser.firstName || theUser.username;
      const userEmail = theUser.email;

      const authtoken = jwt.sign(payload, JWT_SECRET);
      console.log(authMessages.loginSuccess);
      return res.status(200).json({ authtoken, userName, userEmail });
    } else {
      authLogger.error(authMessages.userNotFound);
      return res.status(404).json({ error: authMessages.userNotFound });
    }
  } catch (e) {
    authLogger.error(e);
    return res
      .status(500)
      .json({ error: authMessages.internalServerError, details: e.message });
  }
});

router.put("/update", async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    authLogger.error(authMessages.updateApiError, errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const email = req.headers.email;

    if (!email) {
      authLogger.error(authMessages.emailNotInHeader);
      return res.status(400).json({ error: authMessages.emailNotInHeader });
    }

    const existingUser = await User.findByEmail(email);

    if (!existingUser) {
      authLogger.error(authMessages.userNotFound);
      return res.status(404).json({ error: authMessages.userNotFound });
    }

    existingUser.firstName = req.body.name;
    existingUser.updatedAt = new Date();

    const updatedUser = await existingUser.save();

    const payload = {
      user: {
        id: updatedUser._id.toString(),
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    authLogger.info(authMessages.userUpdateSuccess);

    res.json({ authtoken });
  } catch (error) {
    authLogger.error(error);
    return res.status(500).json({ error: authMessages.internalServerError });
  }
});

module.exports = router;
