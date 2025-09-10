const express = require("express");
const { Log, User } = require("../models/database.js");
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

router.get("/", authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ date: -1 });
    footprintLogger.debug(
      `Fetched ${logs.length} logs for user ${req.user.id}`
    );
    res.json(logs);
  } catch (error) {
    footprintLogger.error("Error fetching logs:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!log) {
      footprintLogger.warn(
        `Log not found: ${req.params.id} for user ${req.user.id}`
      );
      return res.status(404).json({ error: "Log not found" });
    }

    footprintLogger.debug(
      `Fetched log ${req.params.id} for user ${req.user.id}`
    );
    res.json(log);
  } catch (error) {
    footprintLogger.error("Error fetching log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { date, activity, co2Saved, details } = req.body;

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
      details,
    });

    const savedLog = await newLog.save();
    footprintLogger.info(`New log created for user ${req.user.id}`, {
      logId: savedLog.logId,
      activity: savedLog.activity,
      co2Saved: savedLog.co2Saved,
    });

    res.status(201).json(savedLog);
  } catch (error) {
    footprintLogger.error("Error creating log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

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
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedLog) {
      footprintLogger.warn(
        `Log not found for update: ${req.params.id} for user ${req.user.id}`
      );
      return res.status(404).json({ error: "Log not found" });
    }

    footprintLogger.info(`Log updated for user ${req.user.id}`, {
      logId: updatedLog.logId,
      activity: updatedLog.activity,
    });

    res.json(updatedLog);
  } catch (error) {
    footprintLogger.error("Error updating log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedLog = await Log.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedLog) {
      footprintLogger.warn(
        `Log not found for deletion: ${req.params.id} for user ${req.user.id}`
      );
      return res.status(404).json({ error: "Log not found" });
    }

    footprintLogger.info(`Log deleted for user ${req.user.id}`, {
      logId: deletedLog.logId,
      activity: deletedLog.activity,
    });

    res.json({ message: "Log deleted successfully" });
  } catch (error) {
    footprintLogger.error("Error deleting log:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

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

    const result =
      stats.length > 0
        ? stats[0]
        : {
            totalCo2Saved: 0,
            activityCount: 0,
            averageCo2PerActivity: 0,
          };

    footprintLogger.debug(`Stats fetched for user ${req.user.id}`, result);
    res.json(result);
  } catch (error) {
    footprintLogger.error("Error getting user stats:", error);
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

router.get("/leaderboard/global", async (req, res) => {
  try {
    const leaderboard = await User.getLeaderboard();
    footprintLogger.debug("Global leaderboard fetched");
    res.json(leaderboard);
  } catch (error) {
    footprintLogger.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats/total-co2", async (req, res) => {
  try {
    const totalCO2 = await User.getTotalCO2();
    footprintLogger.debug("Total CO2 stats fetched");
    res.json(totalCO2);
  } catch (error) {
    footprintLogger.error("Error fetching total CO2 stats:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
