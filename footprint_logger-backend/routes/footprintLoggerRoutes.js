const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

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
