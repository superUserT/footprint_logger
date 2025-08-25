const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
require("dotenv").config();
const { errorMessages } = require("../utils/helper_objects.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("src"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "src")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((_req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  res.locals.nonce = nonce;

  res.setHeader(
    "Content-Security-Policy",
    [
      `script-src 'nonce-${nonce}' 'self' https://cdn.jsdelivr.net https://code.jquery.com`,
      "default-src 'self'",
      "style-src 'self' https://cdn.jsdelivr.net",
      "img-src 'self' data: https://ghchart.rshah.org http://ghchart.rshah.org",
      "connect-src 'self' https://accounts.google.com",
      "font-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "connect-src 'self' https://accounts.google.com http://localhost:* http://localhost:3000",
    ].join("; ")
  );

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
});
// need to work on this
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const isAdmin = (req, res, next) => {
  const allowedEmails = [
    "rantshothabisomail@gmail.com",
    "alanwattscodes@gmail.com",
  ];
  const userEmail =
    req.session.email || req.session.user?.email || req.user?.email;

  if (
    req.session.user &&
    userEmail &&
    allowedEmails.includes(userEmail.toLowerCase())
  ) {
    next();
  } else {
    res.status(403).send(errorMessages.notAdmin);
  }
};

/**
 * Routes that need to be implemented for footprint logger
 *
 * LOGS:
 * Get all logs
 * Get a single log
 * post a log
 * update a log
 * delete a log
 *
 * DASHBOARD:
 * get all logs: specify data
 *
 *
 * AVERAGES:
 * Get all logs and do the calculations
 *
 *
 * Weekly:
 * weekly summaries or streak tracking
 *
 *
 * LEADERBOARD:
 * Simple leaderboard of low-footprint users
 * **/

app.get("/", async (req, res, next) => {
  logger.info("/ called");
  try {
    const db = await connectToDatabase();

    const collection = db.collection("footprintLogs");
    const footprintLogs = await collection.find({}).toArray();
    res.json();
  } catch (error) {
    logger.console.error(errorMessages.cannotConnectToDB);
    next(error);
  }
});

// Get a single gift by ID
app.get("/:id", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const id = req.params.id;
    const gift = await collection.findOne({ id: id });

    if (!gift) {
      return res.status(404).send("Gift not found");
    }

    res.json(gift);
  } catch (e) {
    next(e);
  }
});

// Add a new gift
app.post("/", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const gift = await collection.insertOne(req.body);

    res.status(201).json(gift.ops[0]);
  } catch (e) {
    next(e);
  }
});
