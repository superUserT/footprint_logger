const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logId: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    co2Saved: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.getUserInfo = function () {
  return {
    username: this.username,
    email: this.email,
    isActive: this.isActive,
  };
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.getLeaderboard = async function () {
  try {
    const leaderboard = await this.aggregate([
      {
        $lookup: {
          from: "logs",
          localField: "_id",
          foreignField: "userId",
          as: "userLogs",
        },
      },
      {
        $project: {
          username: 1,
          totalCo2Saved: { $sum: "$userLogs.co2Saved" },
          logCount: { $size: "$userLogs" },
        },
      },
      { $sort: { totalCo2Saved: -1 } },
      { $match: { isActive: true } },
    ]);

    return leaderboard;
  } catch (error) {
    throw new Error(`Error calculating leaderboard: ${error.message}`);
  }
};

userSchema.statics.getUserTotalCO2 = async function (userId) {
  try {
    const result = await this.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "logs",
          localField: "_id",
          foreignField: "userId",
          as: "userLogs",
        },
      },
      {
        $project: {
          username: 1,
          totalCo2Saved: { $sum: "$userLogs.co2Saved" },
        },
      },
    ]);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(`Error calculating user CO2: ${error.message}`);
  }
};

userSchema.statics.getTotalCO2 = async function () {
  try {
    const result = await this.aggregate([
      {
        $lookup: {
          from: "logs",
          localField: "_id",
          foreignField: "userId",
          as: "userLogs",
        },
      },
      {
        $group: {
          _id: null,
          totalCo2Saved: { $sum: { $sum: "$userLogs.co2Saved" } },
          userCount: { $sum: 1 },
        },
      },
    ]);

    return result.length > 0 ? result[0] : { totalCo2Saved: 0, userCount: 0 };
  } catch (error) {
    throw new Error(`Error calculating total CO2: ${error.message}`);
  }
};

logSchema.statics.findByUserId = function (userId) {
  return this.find({ userId }).sort({ date: -1 });
};

logSchema.statics.getUserLogStats = async function (userId) {
  try {
    const stats = await this.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$userId",
          totalCo2Saved: { $sum: "$co2Saved" },
          activityCount: { $sum: 1 },
          averageCo2PerActivity: { $avg: "$co2Saved" },
        },
      },
    ]);

    return stats.length > 0 ? stats[0] : null;
  } catch (error) {
    throw new Error(`Error getting user log stats: ${error.message}`);
  }
};

const User = mongoose.model("User", userSchema);
const Log = mongoose.model("Log", logSchema);

module.exports = { User, Log };
