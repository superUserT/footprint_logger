// footprintLoggerRoutes.js
const express = require("express");
const { Log, User } = require("../models/database.js");
const { logger } = require("../footprint_loggger.js");
const { errorMessages } = require("../utils/helper_objects.js");
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Get all logs for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    logger.error("Error fetching logs:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

// Get a single log by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!log) {
      return res.status(404).json({ error: "Log not found" });
    }

    res.json(log);
  } catch (error) {
    logger.error("Error fetching log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

// Create a new log
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { date, activity, co2Saved, details } = req.body;

    // Get the next logId for this user
    const lastLog = await Log.findOne({ userId: req.user.id })
        .sort({ logId: -1 })
        .limit(1);

    const nextLogId = lastLog ? lastLog.logId + 1 : 1;

    const newLog = new Log({
      userId: req.user.id,
      logId: nextLogId,
      date: new Date(date),
      activity,
      co2Saved: parseFloat(co2Saved),
      details
    });

    const savedLog = await newLog.save();
    logger.info(`New log created for user ${req.user.id}`);

    res.status(201).json(savedLog);
  } catch (error) {
    logger.error("Error creating log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

// Update a log
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { date, activity, co2Saved, details } = req.body;

    const updatedLog = await Log.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        {
          date: new Date(date),
          activity,
          co2Saved: parseFloat(co2Saved),
          details,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
    );

    if (!updatedLog) {
      return res.status(404).json({ error: "Log not found" });
    }

    res.json(updatedLog);
  } catch (error) {
    logger.error("Error updating log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

// Delete a log
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedLog = await Log.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deletedLog) {
      return res.status(404).json({ error: "Log not found" });
    }

    res.json({ message: "Log deleted successfully" });
  } catch (error) {
    logger.error("Error deleting log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

// Get user log statistics
router.get("/user/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await Log.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$userId",
          totalCo2Saved: { $sum: "$co2Saved" },
          activityCount: { $sum: 1 },
          averageCo2PerActivity: { $avg: "$co2Saved" },
        },
      },
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalCo2Saved: 0,
      activityCount: 0,
      averageCo2PerActivity: 0
    };

    res.json(result);
  } catch (error) {
    logger.error("Error getting user stats:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

// Get leaderboard
router.get("/leaderboard/global", async (req, res) => {
  try {
    const leaderboard = await User.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total CO2 saved
router.get("/stats/total-co2", async (req, res) => {
  try {
    const totalCO2 = await User.getTotalCO2();
    res.json(totalCO2);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;