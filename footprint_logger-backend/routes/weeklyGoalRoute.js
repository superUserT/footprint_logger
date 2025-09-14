const express = require("express");
const { WeeklyGoal } = require("../models/database.js");
const { footprintLogger } = require("../footprint_loggger.js");
const { errorMessages } = require("../utils/helper_objects.js");
const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

router.get("/weeklygoal", authenticateToken, async (req, res) => {
  try {
    const weeklyGoal = await WeeklyGoal.findOne({ userId: req.user.id })
      .sort({ startDate: -1 })
      .limit(1);

    footprintLogger.debug("Weekly goal fetched");
    res.json(weeklyGoal);
  } catch (error) {
    footprintLogger.error("Error fetching weekly goal:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

router.post("/weeklygoal", authenticateToken, async (req, res) => {
  try {
    const { goal, startDate } = req.body;

    const lastGoal = await WeeklyGoal.findOne().sort({ id: -1 }).limit(1);
    const nextId = lastGoal ? lastGoal.id + 1 : 1;

    const newWeeklyGoal = new WeeklyGoal({
      userId: req.user.id,
      id: nextId,
      goal: goal,
      startDate: startDate || new Date(),
    });

    const savedWeeklyGoal = await newWeeklyGoal.save();
    footprintLogger.info(`New weekly goal created for user ${req.user.id}`, {
      goal: savedWeeklyGoal.goal,
    });

    res.status(201).json(savedWeeklyGoal);
  } catch (error) {
    footprintLogger.error("Error creating weekly goal:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

module.exports = router;
